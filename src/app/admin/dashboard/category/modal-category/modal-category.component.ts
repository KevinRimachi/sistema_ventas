import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../../core/services/admin/category/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Categoria } from '../../../../interface/categoria.interface';
import { Subscription } from 'rxjs';
import { AlertComponent } from "../../components/alert/alert.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AlertComponent],
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.css'],
})
export class ModalCategoryComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() categoryAdded = new EventEmitter<void>();
  @Output() categoryUpdated = new EventEmitter<void>();
  @Input() category: Categoria | null = null;

  categoryForm: FormGroup;
  loading: boolean = false;
  showConfirmation: boolean = false;
  confirmationMessage: string = '';
  actionToPerform: 'update' | 'create'| null = null; // Incluye 'create'

  private minLoadingTime = 2500;
  private loadingTimer?: ReturnType<typeof setTimeout>;
  private requestSubscription?: Subscription;
  private startLoadingTime?: number;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _categorySevice: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      nombre_categoria: ['', Validators.required],
    });

    this.categoryForm.get('nombre_categoria')?.valueChanges.subscribe(value => {
      this.capitalizeFirstLetter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && this.category) {
      this.categoryForm.patchValue({
        nombre_categoria: this.category.nombre_categoria,
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.categoryForm.invalid) {
      this.showValidatonErrors();
      return;
    }

    this.confirmationMessage = this.category
      ? '¿Estás seguro de que deseas actualizar esta categoría?'
      : '¿Estás seguro de que deseas registrar esta categoría?';

    this.actionToPerform = this.category ? 'update' : 'create'; // Cambia 'create' a 'update'

    this.showConfirmation = true;
  }

   onConfirmAction() {
    if (this.actionToPerform === 'update' && this.category) {
      this.startLoadingTime = Date.now();
      this.loading = true;

      this.loadingTimer = setTimeout(() => {
        this.loading = false;
      }, this.minLoadingTime);

      const formValues = this.categoryForm.value;

      this.requestSubscription = this._categorySevice.updateCategory(this.category.id, formValues).subscribe({
        next: () => {
          this.toastr.success('La categoría fue actualizada correctamente', 'Categoría');
          this.categoryUpdated.emit();
          this.finishLoading();
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          this.finishLoading();
          this.showError(error);
        },
      });
    } else if (this.actionToPerform === 'create') {
      this.startLoadingTime = Date.now();
      this.loading = true;

      this.loadingTimer = setTimeout(() => {
        this.loading = false;
      }, this.minLoadingTime);

      const formValues = this.categoryForm.value;

      this.requestSubscription = this._categorySevice.createCategory(formValues).subscribe({
        next: () => {
          this.toastr.success('La categoría fue registrada correctamente', 'Categoría');
          this.categoryAdded.emit();
          this.finishLoading();
          this.closeModal();
        },
        error: (error: HttpErrorResponse) => {
          this.finishLoading();
          this.showError(error);
        },
      });
    }

    this.showConfirmation = false;
  }

  onCancelAction() {
    this.showConfirmation = false;
    this.closeModal();
  }

  private capitalizeFirstLetter() {
    const control = this.categoryForm.get('nombre_categoria');
    if (control) {
      const value = control.value;
      if (value) {
        const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        control.setValue(capitalizedValue, { emitEvent: false });
      }
    }
  }

  private finishLoading() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
    }

    const elapsedTime = Date.now() - (this.startLoadingTime || 0);
    const remainingTime = this.minLoadingTime - elapsedTime;

    if (remainingTime > 0) {
      setTimeout(() => {
        this.loading = false;
      }, remainingTime);
    } else {
      this.loading = false;
    }
  }

  private showError(error: HttpErrorResponse): void {
    const errorMessage =
      error.error?.message ||
      'Ups ocurrió un error, comuníquese con el administrador';
    this.toastr.error(errorMessage, 'Error');
  }

  showValidatonErrors(): void {
    const { nombre_categoria } = this.categoryForm.controls;
    if (nombre_categoria.errors?.['required']) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.categoryForm.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}

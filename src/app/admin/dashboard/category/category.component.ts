import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/admin/category/category.service';
import { Categoria } from '../../../interface/categoria.interface';
import { CommonModule } from '@angular/common';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { Subscription } from 'rxjs';
import { AlertComponent } from "../components/alert/alert.component";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ModalCategoryComponent, AlertComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  listaCategoria: Categoria[] = [];
  colores: string[] = [];
  isModalOpen = false;
  loading = false;
  selectedCategory: Categoria | null = null;
  showAlert = false;
  alertMessage = '';

  private minLoadingTime = 2000; // 10 segundos
  private loadingTimer?: ReturnType<typeof setTimeout>; // Temporizador para la carga mínima
  private requestSubscription?: Subscription; // Suscripción a la solicitud de datos
  private startLoadingTime?: number; // Hora de inicio de la carga
  private categoryToDeleteId?: number;
  private categoryToDeleteName?: string;

  constructor(private _categoriaService: CategoryService) {}

  ngOnInit(): void {
    this.getCategoria();
  }

  getCategoria() {
    this.startLoadingTime = Date.now();
    this.loading = true;

    // Configurar el temporizador para el tiempo mínimo de carga
    this.loadingTimer = setTimeout(() => {
      this.loading = false;
    }, this.minLoadingTime);

    // Iniciar la solicitud de datos
    this.requestSubscription = this._categoriaService.getCategory().subscribe({
      next: (data) => {
        this.listaCategoria = data;
        this.generarColoresAleatorios();
        this.finishLoading();
      },
      error: (err) => {
        // console.error(err);
        this.finishLoading();
      },
    });
  }

  finishLoading() {
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer); // Limpiar el temporizador del tiempo mínimo de carga
    }

    // Asegurarse de que la carga mínima de 10 segundos se cumpla
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

  generarColoresAleatorios() {
    this.colores = this.listaCategoria.map(() => this.getColorAleatorio());
  }

  getColorAleatorio(): string {
    // Genera un color hexadecimal aleatorio
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  abrirModal(category?: Categoria) {
    this.selectedCategory = category || null;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedCategory = null; 
  }

  onCategoryAdded() {
    this.getCategoria(); // Recarga la lista de categorías
  }

  onCategoryUpdated() {
    this.getCategoria(); // Recarga la lista de categorías
    this.cerrarModal(); // Cerrar el modal después de actualizar
  }

  editarCategoria(category: Categoria) {
    this.abrirModal(category);
  }

  eliminarCategoria(categoryId: number) {
    const category = this.listaCategoria.find(c => c.id === categoryId);
    if (category) {
      this.categoryToDeleteId = category.id;
      this.categoryToDeleteName = category.nombre_categoria;
      this.alertMessage = `¿Estás seguro de que deseas eliminar "${this.categoryToDeleteName}" esta categoría?`;
      this.showAlert = true;
    }
  }

  handleConfirmDelete() {
    if (this.categoryToDeleteId !== undefined) {
      this._categoriaService.deleteCategory(this.categoryToDeleteId).subscribe({
        next: () => {
          this.getCategoria(); // Recarga la lista de categorías después de eliminar
          this.showAlert = false; // Oculta la alerta
        },
        error: (err) => {
          console.error(err);
          this.showAlert = false; // Oculta la alerta en caso de error
        },
      });
    }
  }

  handleCancelDelete() {
    this.showAlert = false; // Oculta la alerta
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'center', // Posición horizontal
      verticalPosition: 'top', // Posición vertical
      panelClass: ['success-snackbar'], // Clase CSS para el color verde
    });
  }
}

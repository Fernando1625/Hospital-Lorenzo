
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialog {

  titulo = input<string>('Confirmar acción');

  mensaje = input<string>('¿Deseas continuar?');

  textoConfirmar = input<string>('Confirmar');

  // Avisar al componente padre de la decisión
  confirmado = output<void>();

  cancelado = output<void>();

  confirmar(): void {
    this.confirmado.emit();
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: 'app-id-widget',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './id-widget.component.html',
  styleUrls: ['./id-widget.component.scss']
})
export class IdWidgetComponent {
  @Input() data!: string;
  toolTipMessage: string = "Copy";

  async copyToClipboard(tooltip: MatTooltip, clipboardContent: string): Promise<void> {
    await navigator.clipboard.writeText(clipboardContent);

    this.toolTipMessage = "Copied!";

    tooltip.show();
    setTimeout(async () => {
      // wait for the tooltip to close
      while (tooltip._isTooltipVisible() !== false) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // sleep for one sec
      }

      // return the tooltip to default message
      this.toolTipMessage = "Copy";
    }, 2500);
  }
}

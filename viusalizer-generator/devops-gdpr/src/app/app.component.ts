import { Component } from '@angular/core';
import { DefaultService } from './zipkin/api/default.service';
import { Observable } from 'rxjs';
import { ListOfTraces } from './zipkin';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { ConnectionDetailDialogComponent } from './dialog/connection-detail-dialog/connection-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'devops-gdpr';

  curve = shape.curveNatural;

  traces: ListOfTraces = [];

  public nodes: Node[] = [];
  public edges: Edge[] = [];

  constructor(api: DefaultService, public dialog: MatDialog) {
    api
      .tracesGet(
        null,
        null,
        null,
        null,
        null,
        1593502052301,
        900000,
        100,
        'response'
      )
      .subscribe((ans) => {
        this.traces = ans.body;
      });

    api
      .traceTraceIdGet('2c315a44c7088dcd0772746b270376b0', 'response')
      .subscribe((ans) => {
        let json = ans.body;

        let set = new Set(json.map((span) => span.localEndpoint.serviceName));
        let services = Array.from(set);
        this.nodes = services.map((service) => {
          return {
            id: service,
            label: service,
            data: {
              location: json.filter(
                (s) => s.localEndpoint.serviceName === service
              )[0].tags['gdpr.location'],
            },
          };
        });
        console.log(this.nodes);

        json.forEach((span) => {
          if (span.parentId) {
            let edge = {
              id: span.id,
              target: span.localEndpoint.serviceName,
              source: json.filter((s) => s.id == span.parentId)[0].localEndpoint
                .serviceName,
              label: 'connection',
              data: {
                reason: span.tags['gdpr.reason'],
                ttl: span.tags['gdpr.ttl'],
              },
            };
            if (span.localEndpoint.serviceName != edge.source) {
              this.edges.push(edge);
              // this.edges.push(edge);
            }
          }
        });
        console.log(this.edges);
      });
  }

  openDialog(edge: any): void {
    const dialogRef = this.dialog.open(ConnectionDetailDialogComponent, {
      data: { connection: edge },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

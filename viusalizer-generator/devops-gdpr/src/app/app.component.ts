import { Component } from '@angular/core';
import { DefaultService } from './zipkin/api/default.service';
import { Observable } from 'rxjs';
import { ListOfTraces } from './zipkin';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { ConnectionDetailDialogComponent } from './dialog/connection-detail-dialog/connection-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ServerDetailDialogComponent } from './dialog/server-detail-dialog/server-detail-dialog.component';

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
      .traceTraceIdGet('b327a1c96dbcb301e624d6b5dbc9bd51', 'response')
      .subscribe((ans) => {
        let json = ans.body;

        let set = new Set(json.map((span) => span.localEndpoint.serviceName));
        let services = Array.from(set);
        this.nodes = services.map((service) => {
          let serviceSpans = json.filter(
            (s) => s.localEndpoint.serviceName === service
          );
          if (serviceSpans.length > 1) {
            serviceSpans = serviceSpans.filter((s) => s.kind === 'SERVER');
          }
          return {
            id: service,
            label: service,
            data: {
              location: serviceSpans[0].tags['gdpr.location'],
              purpose: serviceSpans[0].tags['gdpr.purpose'],
              legalBasis: serviceSpans[0].tags['gdpr.legalBasis'],
              span: serviceSpans[0],
            },
          };
        });
        console.log(this.nodes);

        json.forEach((span) => {
          if (span.parentId) {
            let edge = {
              id: 'span' + span.id,
              target: span.localEndpoint.serviceName,
              source: json.filter((s) => s.id == span.parentId)[0].localEndpoint
                .serviceName,
              label: 'connection',
              data: {
                span,
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
      data: { ...edge },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openServerDialog(node: any): void {
    const dialogRef = this.dialog.open(ServerDetailDialogComponent, {
      data: { ...node },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

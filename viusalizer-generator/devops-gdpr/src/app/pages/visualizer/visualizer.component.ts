import { Component, OnInit, HostListener } from '@angular/core';
import { DefaultService } from '../../zipkin/api/default.service';
import { Observable } from 'rxjs';
import { ListOfTraces, Trace } from './../../zipkin';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';
import { ConnectionDetailDialogComponent } from '../../dialog/connection-detail-dialog/connection-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ServerDetailDialogComponent } from '../../dialog/server-detail-dialog/server-detail-dialog.component';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss'],
})
export class VisualizerComponent {
  width: number;
  height: number;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = window.innerWidth;
    this.height = window.innerHeight - 64; // Toolbar height
  }
  curve = shape.curveNatural;

  traces: ListOfTraces = [];

  public nodes: Node[] = [];
  public edges: Edge[] = [];

  constructor(
    api: DefaultService,
    private appState: AppStateService,
    public dialog: MatDialog
  ) {
    this.height = window.innerHeight - 64;
    this.width = window.innerWidth;
    api
      .tracesGet(
        null,
        null,
        null,
        40000,
        null,
        new Date().getTime(),
        90000000,
        100,
        'response'
      )
      .subscribe((ans) => {
        this.traces = ans.body;
        let analyzeSpans = this.traces[0].filter(
          (span) => span.kind === 'CLIENT' || span.kind === 'SERVER'
        );
        this.appState.endpoints = analyzeSpans.map((span) =>
          this.getHostFromURL(span.tags['http.url'])
        );
        this.getEdgesAndNodesFromSpan(analyzeSpans);
      });
  }

  private getHostFromURL(url: string) {
    let split = new RegExp('^(.*:)//([A-Za-z0-9-.]+)(:[0-9]+)?(.*)$').exec(url);
    return split[1] + '//' + split[2] + split[3];
  }

  private getEdgesAndNodesFromSpan(json: Trace) {
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

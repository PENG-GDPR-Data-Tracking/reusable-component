import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Trace, Span } from 'src/app/zipkin';
import { PolicySnippetsComponent } from 'src/app/pages/policy-snippets/policy-snippets.component';
import { HttpClient } from '@angular/common/http';
import { OpenAPIV3 } from 'openapi-types';

@Component({
  selector: 'app-connection-detail-dialog',
  templateUrl: './connection-detail-dialog.component.html',
  styleUrls: ['./connection-detail-dialog.component.scss'],
})
export class ConnectionDetailDialogComponent implements OnInit {
  public loading = true;
  public requestData: string = '';
  public category: string = '';
  public reason: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { span: Span },
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.httpClient
      .get<OpenAPIV3.Document>(
        PolicySnippetsComponent.getHostFromURL(
          this.data.span.tags['http.url']
        ) + '/openapi/openapi.json'
      )
      .subscribe((document) => {
        this.loading = false;
        this.category = (document.components.schemas[
          Object.keys(document.components.schemas)[0]
        ] as any)['x-gdpr-data-type'];
        this.reason = (document.components.schemas[
          Object.keys(document.components.schemas)[0]
        ] as any)['x-gdpr-data-reason'];
        let properties = (document.components.schemas[
          Object.keys(document.components.schemas)[0]
        ] as any).properties;
        let example = {};
        Object.keys(properties).forEach((key) => {
          example[key] = properties[key].description;
        });

        this.requestData = JSON.stringify(example, null, 2);
      });
  }
}

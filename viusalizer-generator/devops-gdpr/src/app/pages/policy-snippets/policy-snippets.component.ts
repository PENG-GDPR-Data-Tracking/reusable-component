import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';
import { AppStateService } from 'src/app/app-state.service';

@Component({
  selector: 'app-policy-snippets',
  templateUrl: './policy-snippets.component.html',
  styleUrls: ['./policy-snippets.component.scss'],
})
export class PolicySnippetsComponent implements OnInit {
  specialEntities;
  personalEntities;
  anonymousEntities;

  constructor(
    private httpClient: HttpClient,
    private appState: AppStateService
  ) {}

  public getProperties(object: Object) {
    return Object.keys(object);
  }

  ngOnInit(): void {
    this.getAllPolicies(
      Array.from(
        new Set([
          ...this.appState.endpoints.map((e) => e + '/swagger/openapi.json'),
        ])
      )
    ).subscribe((documents) => {
      this.personalEntities = documents.reduce((accumulator, currentDoc) => {
        return [...accumulator, ...this.getEntitiesFromSchema(currentDoc)];
      }, []);
    });
  }

  private getEntitiesFromSchema(schema: OpenAPIV3.Document) {
    if (schema == null) {
      return [];
    }
    return Object.keys(schema.components.schemas).map((schemaKey) => {
      return schema.components.schemas[schemaKey];
    });
  }
  public getAllPolicies(
    enpoints: string[]
  ): Observable<(OpenAPIV3.Document | null)[]> {
    return forkJoin(
      enpoints.map((e) => {
        return this.httpClient
          .get<OpenAPIV3.Document>(e)
          .pipe<OpenAPIV3.Document | null>(catchError((err) => of(null)));
      })
    );
  }
}

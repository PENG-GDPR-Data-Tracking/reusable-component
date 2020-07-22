import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OpenAPIV3 } from 'openapi-types';
import { AppStateService } from 'src/app/app-state.service';
import { ListOfTraces } from 'src/app/zipkin';

@Component({
  selector: 'app-policy-snippets',
  templateUrl: './policy-snippets.component.html',
  styleUrls: ['./policy-snippets.component.scss'],
})
export class PolicySnippetsComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private appState: AppStateService
  ) {}
  specialEntities;
  personalEntities;
  anonymousEntities;

  purposes: string[] = [];
  locations: string[] = [];
  maxTTL: number;
  legalBasis: string[] = [];

  private endpoints: string[] = [];

  public static getHostFromURL(url: string) {
    let split = new RegExp('^(.*:)//([A-Za-z0-9-.]+)(:[0-9]+)?(.*)$').exec(url);
    // Protocol + "//" + "host" + "port"
    return split[1] + '//' + split[2] + split[3] ? split[3] : '';
  }

  public getProperties(object: Object) {
    return Object.keys(object);
  }

  ngOnInit(): void {
    this.appState.traces.subscribe((traces) => {
      traces.forEach((trace) => {
        this.endpoints = [
          ...this.endpoints,
          ...trace.map((span) =>
            PolicySnippetsComponent.getHostFromURL(span.tags['http.url'])
          ),
        ];
      });
      this.getAllPolicies(
        Array.from(
          new Set([...this.endpoints.map((e) => e + '/openapi/openapi.json')])
        )
      ).subscribe((documents) => {
        let entities = documents.reduce((accumulator, currentDoc) => {
          return [...accumulator, ...this.getEntitiesFromSchema(currentDoc)];
        }, new Array<OpenAPIV3.ReferenceObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject>());
        this.personalEntities = entities.filter(
          (entity) => entity['x-gdpr-data-type'] === 'personal'
        );
        this.anonymousEntities = entities.filter(
          (entity) => entity['x-gdpr-data-type'] === 'anonymous'
        );
        this.specialEntities = entities.filter(
          (entity) => entity['x-gdpr-data-type'] === 'special'
        );
      });
      this.locations = Array.from(
        new Set(this.getTagsFromAllTraces(traces, 'gdpr.location'))
      );
      this.legalBasis = Array.from(
        new Set(this.getTagsFromAllTraces(traces, 'gdpr.legalBasis'))
      );
      this.purposes = Array.from(
        new Set(this.getTagsFromAllTraces(traces, 'gdpr.purpose'))
      );
      this.maxTTL = Number.parseFloat(
        this.getTagsFromAllTraces(traces, 'gdpr.ttl').reduce((acc, ttl) => {
          if (Number.parseFloat(acc) >= Number.parseFloat(ttl)) return acc;
          return ttl;
        })
      );
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
  public getTagsFromAllTraces(traces: ListOfTraces, tag: string): string[] {
    return traces.reduce((acc, spans) => {
      return [
        ...acc,
        ...spans.reduce((accumulator, span) => {
          if (span.tags[tag]) {
            return [...accumulator, span.tags[tag]];
          }
          return accumulator;
        }, []),
      ];
    }, []);
  }
}

import { Injectable } from '@angular/core';
import { DefaultService, ListOfTraces } from './zipkin';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  get traces(): Observable<ListOfTraces> {
    if (this.traceObserable == null) {
      this.traceObserable = this.api
        .tracesGet(
          null,
          null,
          null,
          null,
          null,
          new Date().getTime(),
          90000000,
          100,
          'response'
        )
        .pipe(
          map((ans) => {
            return ans.body.map((trace) => {
              return trace.filter(
                (span) =>
                  (span.kind === 'CLIENT' || span.kind === 'SERVER') &&
                  span.tags['http.error_message'] == undefined
              );
            });
          }),
          shareReplay(1)
        );
    }
    return this.traceObserable;
  }

  private traceObserable: Observable<ListOfTraces>;

  constructor(private api: DefaultService) {}
}

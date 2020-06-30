import { Component } from '@angular/core';
import { DefaultService } from './zipkin/api/default.service';
import { Observable } from 'rxjs';
import { ListOfTraces } from './zipkin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'devops-gdpr';

  traces: ListOfTraces = []

  constructor(api: DefaultService){
    api.tracesGet(null, null, null, null,null,1593500850091,900000, 100, "response", true).subscribe(ans => {
      this.traces = ans.body;
    })
  }
}

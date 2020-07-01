import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { HttpClientModule } from '@angular/common/http';
import { Configuration, ConfigurationParameters } from './zipkin/configuration';
import { ApiModule } from './zipkin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConnectionDetailDialogComponent } from './dialog/connection-detail-dialog/connection-detail-dialog.component';
import { ServerDetailDialogComponent } from './dialog/server-detail-dialog/server-detail-dialog.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    // set configuration parameters here.
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    ConnectionDetailDialogComponent,
    ServerDetailDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    ApiModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  entryComponents: [
    ConnectionDetailDialogComponent,
    ServerDetailDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

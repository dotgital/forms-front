import { ServicesTypeConfigComponent } from './_components/services-type-config/services-type-config.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './auth/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetComponent } from './auth/reset/reset.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { GraphQLModule } from './graphql.module';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { DisableFormDirective } from './_directives/disable-form.directive';
import { FillComponent } from './forms/fill/fill.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsLayoutComponent } from './settings/settings-layout/settings-layout.component';
import { Moment } from 'moment';


import { ClientsListComponent } from './clients/clients-list/clients-list.component';
import { ClientsViewComponent } from './clients/clients-view/clients-view.component';
import { ClientProfileComponent } from './clients/clients-view/components/client-profile/client-profile.component';
import { SearchableSelectComponent } from './_components/searchable-select/searchable-select.component';
import { DropdownOptionsComponent } from './_components/dropdown-options/dropdown-options.component';
import { OverlayLoadingComponent } from './_components/overlay-loading/overlay-loading.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { UsersViewComponent } from './users/users-view/users-view.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserProfileComponent } from './users/components/user-profile/user-profile.component';
import { SearchableSelectMultipleComponent } from './_components/searchable-select-multiple/searchable-select-multiple.component';
import { SettingsPermissionsComponent } from './settings/settings-permissions/settings-permissions.component';
import { ColumnSelectorComponent } from './_components/column-selector/column-selector.component';
import { DataTableComponent } from './_components/data-table/data-table.component';
import { AvatarComponent } from './_components/avatar/avatar.component';
import { UsersPermissionsComponent } from './users/users-permissions/users-permissions.component';
import { SettingsPermissionsUserComponent } from './_components/settings-permissions-user/settings-permissions-user.component';
import { AfterValueChangedDirective } from './_directives/after-value-changed.directive';
import { SettingsFiltersComponent } from './settings/settings-filters/settings-filters.component';
import { FilterConfigComponent } from './settings/settings-filters/filter-config/filter-config.component';
import { AutocompleteCreateComponent } from './_components/autocomplete-create/autocomplete-create.component';
import { SettingsServicesTemplatesComponent } from './settings/settings-services-templates/settings-services-templates.component';
import { ActivitiesComponent } from './_components/activities/activities.component';
import { ServicesTypeSelectorComponent } from './_components/services-type-selector/services-type-selector.component';
import { ServiceInfoComponent } from './clients/clients-view/components/service-info/service-info.component';
import { SettingsFieldsComponent } from './settings/settings-fields/settings-fields.component';
import { SettingsFieldsModalComponent } from './_components/settings-fields-modal/settings-fields-modal.component';
import { DeleteWarningComponent } from './_components/delete-warning/delete-warning.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    ForgotComponent,
    ResetComponent,
    DisableFormDirective,
    FillComponent,
    ClientsViewComponent,
    SettingsComponent,
    SettingsLayoutComponent,
    ClientProfileComponent,
    ClientsListComponent,
    SearchableSelectComponent,
    DropdownOptionsComponent,
    OverlayLoadingComponent,
    RegistrationComponent,
    UsersViewComponent,
    UsersListComponent,
    UserProfileComponent,
    SearchableSelectMultipleComponent,
    SettingsPermissionsComponent,
    ColumnSelectorComponent,
    DataTableComponent,
    AvatarComponent,
    UsersPermissionsComponent,
    SettingsPermissionsUserComponent,
    AfterValueChangedDirective,
    SettingsFiltersComponent,
    FilterConfigComponent,
    ServicesTypeConfigComponent,
    AutocompleteCreateComponent,
    SettingsServicesTemplatesComponent,
    ActivitiesComponent,
    ServicesTypeSelectorComponent,
    ServiceInfoComponent,
    SettingsFieldsComponent,
    SettingsFieldsModalComponent,
    DeleteWarningComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSortModule,
    NgxMatSelectSearchModule,
    DragDropModule,
    OverlayModule,
    GraphQLModule,
    MatSelectModule,
    MatRadioModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

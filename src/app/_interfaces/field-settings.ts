export interface FieldSettings {
  fields: [{
    name: string,
    label: string,
    column: string,
    position: number,
    // custom: boolean,
    // customNumber: number,
    visible: boolean,
    fieldType: string,
    options: []
  }];
}

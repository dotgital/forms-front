import { CrudService } from './../../services/crud.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-warning',
  templateUrl: './delete-warning.component.html',
  styleUrls: ['./delete-warning.component.scss']
})
export class DeleteWarningComponent implements OnInit {
  loading: boolean;


  constructor(
    public dialogRef: MatDialogRef<DeleteWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crud: CrudService,
    ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteRecord() {
    this.loading = true;
    this.crud.deleteRecord(this.data.contentType, this.data.id ).subscribe(res => {
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(res);
      }, 5000);
    });
  }

}

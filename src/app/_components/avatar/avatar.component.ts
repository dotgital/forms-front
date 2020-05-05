import { CrudService } from './../../services/crud.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {
  @ViewChild('avatarInput') avatarInput;
  @Input() size: number;
  @Input() avatarUrl: any;
  @Output() avatarChanged: EventEmitter<boolean> = new EventEmitter();
  public files: Set<File> = new Set();
  public avatar;
  public imageSrc;
  public uploadProgress: number;

  constructor(
    private crud: CrudService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarUrl.currentValue) {
      this.imageSrc = changes.avatarUrl.currentValue;
    };
  }

  ngOnInit(): void {
  }

  preview(files: FileList): void {
    if (files) {
      this.avatar = files.item(0);

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(this.avatar);
    }
    this.avatarChanged.emit(true);
  }

  uploadAvatar(userData) {
    console.log(userData);
    const formData = new FormData();
    formData.append('files', this.avatar, this.avatar.name);
    formData.append('refId', userData.id);
    formData.append('ref', 'user');
    formData.append('source', 'users-permissions');
    formData.append('field', 'avatar');
    this.crud.uploadAvatar(formData).subscribe( data => {
      this.uploadProgress = data.progress === 100 ? 0 : data.progress;
      console.log(data);
    },
    error => {
      console.log(error);
    });
  }

}

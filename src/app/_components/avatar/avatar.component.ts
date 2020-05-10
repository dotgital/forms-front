import { ErrorMessagesService } from 'src/app/services/error-messages.service';
import { CrudService } from './../../services/crud.service';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, OnChanges, ElementRef } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {
  @ViewChild('avatarInput', {static: true}) avatarInput: ElementRef;
  @Input() size: number;
  @Input() avatarUrl: any;
  @Input() disabled: boolean;
  @Output() avatarChanged: EventEmitter<any> = new EventEmitter();

  public files: Set<File> = new Set();
  public avatar;
  public imageSrc;
  public uploadProgress: number;
  public uploadLoading: boolean;

  constructor(
    private crud: CrudService,
    private errorMessageService: ErrorMessagesService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatarUrl && changes.avatarUrl.currentValue) {
      this.imageSrc = changes.avatarUrl.currentValue;
    }
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
    this.avatarChanged.emit({avatarChanged: true});
  }

  uploadAvatar(recordId) {
    this.uploadLoading = true;
    const formData = new FormData();
    formData.append('files', this.avatar, this.avatar.name);
    formData.append('refId', recordId);
    formData.append('ref', 'user');
    formData.append('source', 'users-permissions');
    formData.append('field', 'avatar');
    this.crud.uploadFile(formData).subscribe( data => {
      this.uploadProgress = data.progress === 100 ? 101 : data.progress;
      if (Array.isArray(data)) {
        this.uploadLoading = false;
        this.avatarChanged.emit({avatarUpdated: true, avatarChanged: false});
      }
    },
    error => {
      this.avatarChanged.emit({error: true});
      this.errorMessageService.showError('Upload Failed');
      console.log(error);
    });
  }
}

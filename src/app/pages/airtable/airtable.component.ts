import { Component, OnInit } from '@angular/core';
import { HttpServerService } from 'src/app/services/http-server.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Urlserver } from 'src/app/constants/urlserver';
import { NzUploadXHRArgs, NzUploadFile } from 'ng-zorro-antd/upload';
import { AuthService } from 'src/app/services/auth.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-airtable',
  templateUrl: './airtable.component.html',
  styleUrls: ['./airtable.component.scss']
})

export class AirtableComponent implements OnInit {
  urlUploadImage = Urlserver.URL_UPLOAD_IMAGE;
  total = 1;
  listOfData: any[] = [];
  loadingData = true;
  uploading = false;
  pageSize = 20;
  pageIndex = 1;
  filterFurniture: any[] = [];
  filterStatus: any[] = [];
  filterNameProject: any[] = [];
  filterTypeProject: any[] = [];
  filterImages: any[] = [];
  visibleSearch = false;
  searchValue: Array<{ id: string, value: string }> = [];
  visibleDropdownSearch = false;

  currentRecord: any;
  currentStatus: any;

  idProject: string = '';
  code: string = '';
  phoneNumber: string = '';

  idDataAddNote?: string;
  inputNoteValue?: string;
  showAddNote: boolean = false;

  urlImageFile: string = '';
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  idDataUploadImage: any;

  dropdownSelectedText: string = '';

  validateForm!: UntypedFormGroup;
  controls = [
    { id: "id_name_project", name: "Tên dự án", placeholder: "Chọn dự án", type: "select", valueSelect: this.filterNameProject, searchable: true },
    { id: "Code", name: "Mã KH", placeholder: "" },
    { id: "Phone", name: "Số điện thoại", placeholder: "" },
    { id: "Bed", name: "Giường", placeholder: "" },
    { id: "Status", name: "Trạng thái", placeholder: "Chọn trạng thái", type: "select", valueSelect: this.filterStatus },
    { id: "Furniture", name: "Nội thất", placeholder: "Chọn nội thất", type: "select", valueSelect: this.filterFurniture },
    { id: "Bathroom", name: "Phòng tắm", placeholder: "" },
  ]
  controlArray: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string, type: string, valueSelect: any, searchable: boolean }> = [];

  data: any[] = [];
  submitting = false;
  user = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  inputValue = '';
  filterNotes: Array<{ id_data: string; author: string; avatar: string; content: string; datetime: string }> = [];
  filterAddNotes: any[] = [];

  isVisibleModalNote = false;
  isVisibleModalImage = false;

  constructor(private httpServerService: HttpServerService,
    private modal: NzModalService,
    private message: NzMessageService,
    public authService: AuthService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    // Get the list of columns
    this.loadListOfColumn();
    this.validateForm = this.fb.group({});
    for (let i = 0; i < this.controls.length; i++) {
      this.controlArray.push({ index: i, show: true, id: this.controls[i].id, name: this.controls[i].name, placeholder: this.controls[i].placeholder, type: this.controls[i].type ?? "default", valueSelect: this.controls[i].valueSelect, searchable: this.controls[i].searchable ?? false });
      this.validateForm.addControl(`${this.controls[i].id}`, new UntypedFormControl());
    }
    this.validateForm = this.fb.group({
      id_name_project: ['', [Validators.required]],
      Code: [''],
      Phone: [''],
      Status: [''],
      Bed: [''],
      Furniture: [''],
      Bathroom: [''],
    });
    // Get the list of datas
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  getValueById(list: any[], id: string): string {
    return list.filter(x => x.value == id)[0]?.text;
  }

  getColorStatusById(list: any[], id: string): string {
    return list.filter(x => x.value == id)[0]?.color;
  }

  public loadListOfColumn(): void {
    this.httpServerService.getFurnitureList().subscribe(data => {
      if (data && data.success) {
        data.result.forEach((element: any) => {
          this.filterFurniture.push({ text: element.furniture_name, value: element.id });
        })
      }
    });

    this.httpServerService.getStatusList().subscribe(data => {
      if (data && data.success) {        
        data.result.forEach((element: any) => {
          this.filterStatus.push({ text: element.status_name, value: element.id, color: element.color });
        })
      }
    });

    this.httpServerService.getNameProject().subscribe(data => {
      if (data && data.success) {
        data.result.forEach((element: any) => {
          this.filterNameProject.push({ text: element.name_project, value: element.id });
        })
      }
    });

    this.httpServerService.getTypeProject().subscribe(data => {
      if (data && data.success) {
        data.result.forEach((element: any) => {
          this.filterTypeProject.push({ text: element.type, value: element.id });
        })
      }
    });
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loadingData = true;

    // Get data
    this.httpServerService.getDataProperties(pageIndex, pageSize, sortOrder).subscribe(data => {
      this.loadingData = false;
      this.total = data.total_data;
      this.listOfData = data.result;
      this.pageIndex = data.page;
      this.makeFilterImages();
      this.makeFilterNotes();      
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  reset(): void {
    this.searchValue = [];
  }

  viewPhone(data: any): void {
    if (data.Phone.indexOf("*") >= 0) {
      this.httpServerService.viewPhoneNumber(data.id_name_project, data.id)
        .subscribe(res => {
          if (res && res?.success === true) {
            data.Phone = res.phone;
          }
          else if (res && res?.success === false) {
            this.error(res.result)
          }
        });
    }
  }

  error(message: string): void {
    this.modal.error({
      nzTitle: 'Error',
      nzContent: message,
      nzCentered: true
    });
  }

  setData(id: string, data: any): void {
    this.idDataUploadImage = id;
  }

  customUploadReq = (item: NzUploadXHRArgs) => {

    const formData = new FormData();
    formData.append('data', `{"id_data_properties":${this.idDataUploadImage}}`);
    formData.append('images', item.file as any, item.file.name);

    return this.httpServerService.uploadImage(formData).subscribe(data => {
      if (data && data.success) {
        this.updateImageById(this.idDataUploadImage, data.Image);
        this.message.success(`Tải hình ảnh lên thành công!`);
      } else {
        this.message.error(`Tải hình ảnh lên thất bại!`);
      }
    });
  }

  makeFilterImages(): void {
    let images: any[] = [];
    let urlImages: string[] = [];
    this.filterImages = [];

    this.listOfData.forEach(item => {
      urlImages = [];
      item.Image.forEach((image: string) => {
        urlImages.push(`${Urlserver.URL_GET_IMAGE}${image}`)
      });

      images.push(
        {
          uid: item.id,
          urls: urlImages
        })
    });

    this.filterImages = images;
  }

  makeFilterNotes(): void {
    this.filterNotes = [];
    this.filterAddNotes = [];

    this.listOfData.forEach(item => {
      if (Array.isArray(item.Note)) {
        item.Note.forEach((note: any) => {
          note.note.forEach((subNote: any) => {
            this.filterNotes.push({ id_data: item.id, author: note.name, avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', content: subNote.content, datetime: subNote.note_time })
          })
        });

        this.filterAddNotes.push('');
      }
    });
  }

  getImageById(idData: any) {
    return this.filterImages.find(image => image.uid === idData)?.urls;
  }

  updateImageById(idData: string, Image: any) {
    let urlImages: string[] = [];
    Image.forEach((image: string) => {
      urlImages.push(`${Urlserver.URL_GET_IMAGE}${image}`)
    });
    this.filterImages.find(image => image.uid === idData).urls = urlImages;
  }

  submitFormSearch(): void {
    if (this.validateForm.valid) {
      let values = this.validateForm.value;
      this.httpServerService.sortSearchData(values)
        .subscribe(data => {
          if (data && data.success === true) {
            this.listOfData = data.result;
            this.makeFilterImages();
            this.makeFilterNotes();

            this.visibleDropdownSearch = false;
          } else {
            this.listOfData = [];
          }
        },
          error => {
            this.message.error("Không tìm thấy dữ liệu");
            this.listOfData = [];
            this.visibleDropdownSearch = false;
          });

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getNotesByIdData(idData: string): Array<any> {
    return this.filterNotes.filter(note => note.id_data === idData).reverse();
  }

  countNotesByIdData(idData: string): number {
    let notes = this.getNotesByIdData(idData);
    return notes?.length;
  }

  countImagesByIdData(idData: string): number {
    let images = this.getImageById(idData);
    return images?.length;
  }

  handleSubmit(id_data: number): void {
    const content = this.filterAddNotes[id_data];
    if (!content) {
      return;
    }

    this.httpServerService.insertNote(id_data, content)
      .subscribe(res => {
        if (res && res.success === true) {
          this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
          this.message.success("Thêm ghi chú thành công!");
          this.filterAddNotes[id_data] = '';
        }
      });
  }

  isArray(data: any): boolean {
    return Array.isArray(data);
  }

  setCurrentRecord(data: any): void {
    this.currentRecord = data;
  }

  showModalNote(data: any): void {
    this.currentRecord = data;
    this.isVisibleModalNote = true;
  }

  handleCancelModalNote(): void {
    this.isVisibleModalNote = false;
  }

  showModalImage(data: any): void {
    this.currentStatus = data.Status;
    this.currentRecord = data;
    this.isVisibleModalImage = true;
  }

  handleCancelModalImage(): void {
    this.isVisibleModalImage = false;
  }

  viewPhoneNote(data: any): void {
    if (data.Phone.indexOf("*") >= 0) {
      this.httpServerService.viewPhoneNumber(data.id_name_project, data.id)
        .subscribe(res => {
          if (res && res?.success === true) {
            data.Phone = res.phone;
          }
          else if (res && res?.success === false) {
            this.error(res.result)
          }
        });
    }
  }

  openDropdownSearch(): void {
    this.visibleDropdownSearch = true;
  }

  reloadData(): void {
    this.searchValue = [];    
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }

  changeStatus(value: string): void {
    this.httpServerService.setStatus(this.currentRecord.id, value).subscribe(res => {
      if (res && res?.success === true) {
        this.listOfData.find(elem => elem.id === this.currentRecord.id).Status = value;
        this.message.success("Thay đổi trạng thái thành công!")
      }
    });
  }

  makeSearchValue(): void {
    let values = this.validateForm.value;
    let tags: any[] = [];

    this.controls.forEach((item: any) => {
      switch (item.type) {
        case 'select':
          if (values[item.id]) {
            tags.push({ id: item.id, value: item.name + ': ' + this.getValueById(item.valueSelect, values[item.id]) });
          }
          break;
        default:
          if (values[item.id]) {
            tags.push({ id: item.id, value: item.name + ': ' + values[item.id] });
          }
          break;
      }
    })

    this.searchValue = tags;
  }

  removeSearchValue(tag: any): void {
    this.searchValue = this.searchValue.filter(item => item.id !== tag.id);
  }

  myFunction(): void {
    document.getElementById("myDropdown")?.classList.toggle("show");
  }
}

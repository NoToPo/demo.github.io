import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpServerService } from 'src/app/services/http-server.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Urlserver } from 'src/app/constants/urlserver';
import { NzTableQueryParams } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-data-properties-setting',
  templateUrl: './data-properties-setting.component.html',
  styleUrls: ['./data-properties-setting.component.scss']
})
export class DataPropertiesSettingComponent {
  validateForm!: UntypedFormGroup;
  validateFormEdit!: UntypedFormGroup;
  validateFormSearch!: UntypedFormGroup;
  filterFurniture: any[] = [];
  filterStatus: any[] = [];
  filterNameProject: any[] = [];
  filterTypeProject: any[] = [];

  listOfData: any[] = [];
  total = 1;
  loadingData = true;
  uploading = false;
  pageSize = 20;
  pageIndex = 1;
  idDataUploadImage: any;
  filterImages: any[] = [];

  controls = [
    { id: "Code", name: "Mã KH", placeholder: "Nhập mã KH" },
    { id: "House_Code", name: "Mã nhà", placeholder: "Nhập mã nhà" },
    { id: "Name", name: "Tên khách hàng", placeholder: "Nhập tên KH" },
    { id: "Phone", name: "Số điện thoại", placeholder: "Nhập số điện thoại" },
    { id: "Status", name: "Trạng thái", placeholder: "Chọn trạng thái", type: "select", valueSelect: this.filterStatus },
    { id: "VND_Rental", name: "Giá cho thuê (VNĐ)", placeholder: "Nhập giá cho thuê" },
    { id: "VND_Sale", name: "Giá bán (VNĐ)", placeholder: "Nhập giá bán" },
    { id: "USD_Rental", name: "Giá cho thuê (USD)", placeholder: "Nhập giá cho thuê" },
    { id: "USD_Sale", name: "Giá bán (VNĐ)", placeholder: "Nhập giá cho thuê" },
    { id: "Bathroom", name: "Số phòng tắm", placeholder: "Nhập số phòng tắm" },
    { id: "Bed", name: "Số giường", placeholder: "Nhấp số giường" },
    { id: "Renting_till", name: "Thời hạn cho thuê", placeholder: "Nhập thời hạn cho thuê" },
    { id: "Furniture", name: "Nội thất", placeholder: "Chọn nội thất", type: "select", valueSelect: this.filterFurniture },
    { id: "RoomNumber", name: "Số lượng phòng", placeholder: "Nhập số lượng phòng" },
    { id: "Tower", name: "Toà nhà", placeholder: "Nhập toà nhà" },
    { id: "Floor", name: "Lầu", placeholder: "Nhập lầu" },
    { id: "Pinkbook", name: "Sổ hồng", placeholder: "Nhập sổ hồng" },
    { id: "Email", name: "Email", placeholder: "Nhập email" },
    { id: "Address", name: "Địa chỉ", placeholder: "Nhập địa chỉ" },
    { id: "Sqm", name: "Diện tích", placeholder: "Nhập diện tích" },
    { id: "civil", name: "Dân dụng", placeholder: "Nhập dân dụng" },
    { id: "commission_rate", name: "Tỷ lệ hoa hồng", placeholder: "Nhập tỷ lệ hoa hồng" },
    { id: "Name_Type", name: "Tên loại", placeholder: "Chọn loại", type: "select", valueSelect: this.filterTypeProject },
    { id: "id_name_project", name: "Tên dự án", placeholder: "Chọn dự án", type: "select", valueSelect: this.filterNameProject }
  ]

  controlsSearch = [
    { id: "id_name_project", name: "Tên dự án", placeholder: "Chọn dự án", type: "select", valueSelect: this.filterNameProject, searchable: true },
    { id: "Code", name: "Mã KH", placeholder: "" },
    { id: "Phone", name: "Số điện thoại", placeholder: "" },
    { id: "Bed", name: "Giường", placeholder: "" },
    { id: "Status", name: "Trạng thái", placeholder: "Chọn trạng thái", type: "select", valueSelect: this.filterStatus },
    { id: "Furniture", name: "Nội thất", placeholder: "Chọn nội thất", type: "select", valueSelect: this.filterFurniture },
    { id: "Bathroom", name: "Phòng tắm", placeholder: "" },
  ]
  controlArraySearch: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string, type: string, valueSelect: any, searchable: boolean }> = [];
  controlArray: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string, type: string, valueSelect: any }> = [];
  controlArrayEdit: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string, type: string, valueSelect: any }> = [];
  isCollapse = true;

  fileList: NzUploadFile[] = [];

  data: any[] = [];
  submitting = false;
  user = {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
  };
  inputValue = '';
  filterNotes: Array<{ id_data: string; author: string; avatar: string; content: string; datetime: string }> = [];
  filterAddNotes: any[] = [];

  isVisibleModalAdd = false;
  isVisibleModalEdit = false;
  isVisibleModalNote = false;
  isVisibleModalImage = false;
  currentRecord: any;

  searchValue: Array<{ id: string, value: string }> = [];
  visibleDropdownSearch = false;

  resetForm(): void {
    this.validateForm.reset();
  }

  constructor(private fb: UntypedFormBuilder,
    private httpServerService: HttpServerService,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.loadListOfColumn();

    this.loadDataFromServer(this.pageIndex, this.pageSize, null);

    this.validateForm = this.fb.group({});
    this.validateFormEdit = this.fb.group({});

    this.validateFormSearch = this.fb.group({});
    for (let i = 0; i < this.controlsSearch.length; i++) {
      this.controlArraySearch.push({ index: i, show: true, id: this.controlsSearch[i].id, name: this.controlsSearch[i].name, placeholder: this.controlsSearch[i].placeholder, type: this.controlsSearch[i].type ?? "default", valueSelect: this.controlsSearch[i].valueSelect, searchable: this.controlsSearch[i].searchable ?? false });
      this.validateFormSearch.addControl(`${this.controls[i].id}`, new UntypedFormControl());
    }
    this.validateFormSearch = this.fb.group({
      id_name_project: [null, [Validators.required]],
      Code: [''],
      Phone: [''],
      Status: [''],
      Bed: [''],
      Furniture: [''],
      Bathroom: [''],
    });

    
    for (let i = 0; i < this.controls.length; i++) {
      this.controlArray.push({ index: i, show: true, id: this.controls[i].id, name: this.controls[i].name, placeholder: this.controls[i].placeholder, type: this.controls[i].type ?? "default", valueSelect: this.controls[i].valueSelect });
      this.validateForm.addControl(`${this.controls[i].id}`, new UntypedFormControl());

      this.controlArrayEdit.push({ index: i, show: true, id: this.controls[i].id, name: this.controls[i].name, placeholder: this.controls[i].placeholder, type: this.controls[i].type ?? "default", valueSelect: this.controls[i].valueSelect });
      this.validateFormEdit.addControl(`${this.controls[i].id}`, new UntypedFormControl());
    }

    this.validateFormEdit.addControl('id_data_properties', new UntypedFormControl());
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortOrder: string | null,
  ): void {
    this.loadingData = true;

    // Get data
    this.httpServerService.getModDataProperties(pageIndex, pageSize, sortOrder)
    .subscribe(data => {
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
    this.loadDataFromServer(pageIndex, pageSize, sortField);
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
          this.filterTypeProject.push({ text: element.note, value: element.id });
        })
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formData = new FormData();
      let values = this.validateForm.value;

      this.controls.forEach((control: any) => {
        if (control.type === 'select') {
          values[control.id] = parseInt(values[control.id]);
        }
      })

      let dataJson = JSON.stringify(values);

      formData.append('data', dataJson);
      this.fileList.forEach((file: any) => {
        formData.append('images', file);
      });

      this.httpServerService.createDataProperties(formData).subscribe(data => {
        if (data && data.success) {
          this.message.success(`Tạo thành công!`);
          this.loadDataFromServer(this.pageIndex, this.pageSize, null);
        } else {
          this.message.error(`Tạo thất bại!`);
        }
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

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  getValueById(list: any[], id: string): string {
    return list.filter(x => x.value == id)[0]?.text;
  }

  getColorStatusById(list: any[], id: string): string {
    return list.filter(x => x.value == id)[0]?.color;
  }

  getNotesByIdData(idData: string): Array<any> {
    return this.filterNotes.filter(note => note.id_data === idData).reverse();
  }

  handleSubmit(id_data: number): void {
    const content = this.filterAddNotes[id_data];

    if (!content) {
      return;
    }

    this.httpServerService.insertNote(id_data, content)
      .subscribe(res => {
        if (res && res.success === true) {
          this.loadDataFromServer(this.pageIndex, this.pageSize, null);
          this.message.success("Thêm ghi chú thành công!");
          this.filterAddNotes[id_data] = '';
        }
      });
  }

  customUploadReq = (item: NzUploadXHRArgs) => {

    const formData = new FormData();
    formData.append('data', `{"id_data_properties":${this.idDataUploadImage}}`);
    formData.append('images', item.file as any, item.file.name);

    return this.httpServerService.uploadImage(formData).subscribe(data => {
      if (data && data.success) {
        this.updateImageById(this.idDataUploadImage, data.Image);
        this.message.success(`Tải hình ảnh lên thành công.`);
      } else {
        this.message.error(`Tải hình ảnh lên thất bại.`);
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
      if (Array.isArray(item.Note)){
        item.Note.forEach((note: any) => {
          note.note.forEach((subNote: any) => {
            this.filterNotes.push({ id_data: item.id, author: note.name, avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', content: subNote.content, datetime: subNote.note_time })
          })
        });
  
        this.filterAddNotes.push('');
      }
    });
  }

  updateImageById(idData: string, Image: any) {
    let urlImages: string[] = [];
    Image.forEach((image: string) => {
      urlImages.push(`${Urlserver.URL_GET_IMAGE}${image}`)
    });
    this.filterImages.find(image => image.uid === idData).urls = urlImages;
  }

  getImageById(idData: any) {
    return this.filterImages.find(image => image.uid === idData)?.urls;
  }

  setData(id: string, data: any): void {
    this.idDataUploadImage = id;
  }

  isArray(data: any): boolean {
    return Array.isArray(data);
  }

  pupolateData(data: any): void {
    this.controls.forEach(control => {
      this.validateFormEdit.controls[control.id].setValue(data[control.id]?.toString());
    })
    
    this.validateFormEdit.controls['id_data_properties'].setValue(data.id);
  }

  countNotesByIdData(idData: string): number {
    let notes = this.getNotesByIdData(idData);
    return notes?.length;
  }

  countImagesByIdData(idData: string): number {
    let images = this.getImageById(idData);
    return images?.length;
  }

  showModalNote(data: any): void {
    this.currentRecord = data;
    this.controls.forEach(control => {
      this.validateForm.controls[control.id].setValue(data[control.id]);
    })

    this.isVisibleModalNote = true;
  }

  handleCancelModalNote(): void {
    this.isVisibleModalNote = false;
  }

  showModalImage(data: any): void {
    this.currentRecord = data;
    this.controls.forEach(control => {
      this.validateForm.controls[control.id].setValue(data[control.id]);
    })
    this.isVisibleModalImage = true;
  }

  handleCancelModalImage(): void {
    this.isVisibleModalImage = false;
  }

  showAddNew(): void {
    this.isVisibleModalAdd = true;
  }

  showEdit(): void {
    this.isVisibleModalEdit = true;
  }

  handleCancelModalAdd(): void {
    this.isVisibleModalAdd = false;
  }

  handleCancelModalEdit(): void {
    this.isVisibleModalEdit = false;
  }

  submitFormEdit(): void {
    if (this.validateFormEdit.valid) {
      const formData = new FormData();
      let values = this.validateFormEdit.value;      

      this.controls.forEach((control: any) => {
        if (control.type === 'select') {
          values[control.id] = parseInt(values[control.id]);
        }
      })

      let dataJson = JSON.stringify(values);

      formData.append('data', dataJson);
      this.fileList.forEach((file: any) => {
        formData.append('images', file);
      });

      this.httpServerService.updateDataProperties(formData).subscribe(data => {
        if (data && data.success) {
          this.message.success(`Chỉnh sửa thông tin thành công.`);
          this.isVisibleModalEdit = false;
          this.loadDataFromServer(this.pageIndex, this.pageSize, null);
        } else {
          this.message.error(`Chỉnh sửa thông tin thất bại.`);
        }
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

  submitFormSearch(): void {
    if (this.validateFormSearch.valid) {
      let values = this.validateFormSearch.value;
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

  makeSearchValue(): void {
    let values = this.validateFormSearch.value;
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

  openDropdownSearch(): void {
    this.visibleDropdownSearch = true;
  }

  reloadData(): void {
    this.searchValue = [];

    this.loadDataFromServer(this.pageIndex, this.pageSize, null);
  }

  changeStatus(value: string): void {
    this.httpServerService.setStatus(this.currentRecord.id, value).subscribe(res => {
      if (res && res?.success === true) {
        this.listOfData.find(elem => elem.id === this.currentRecord.id).Status = value;
        this.message.success("Thay đổi trạng thái thành công!")
      }
    });
  }
}

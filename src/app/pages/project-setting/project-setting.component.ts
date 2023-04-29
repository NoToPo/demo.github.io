import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpServerService } from 'src/app/services/http-server.service';

@Component({
  selector: 'app-project-setting',
  templateUrl: './project-setting.component.html',
  styleUrls: ['./project-setting.component.scss']
})
export class ProjectSettingComponent implements OnInit {
  validateFormTypeProject!: UntypedFormGroup;
  filterTypeProject: any[] = [];
  loadingData = true;

  controlsTypeProject = [
    {id: "Type", name: "Tên loại dự án", placeholder: "Nhập tên loại dự án" },
    {id: "Note", name: "Ghi chú", placeholder: "Nhập ghi chú" }
  ]
  controlArrayTypeProject: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string }> = [];

  validateFormNameProject!: UntypedFormGroup;
  controlsNameProject = [
    {id: "ProjectName", name: "Tên dự án", placeholder: "Nhập tên dự án" },
    {id: "ProjectType", name: "Loại dự án", placeholder: "Chọn loại dự án", type: "select", valueSelect: this.filterTypeProject },
    {id: "Note", name: "Ghi chú", placeholder: "Nhập ghi chú" },
  ]
  controlArrayNameProject: Array<{ index: number; show: boolean; id: string; name: string, placeholder: string, type: string, valueSelect: any }> = [];
  
  idAddTypeProject = "ADD_TYPE_PROJECT";
  noteOfTypeProject = '';
  typeOfTypeProject = '';
  editCacheTypeProject: { [key: string]: { edit: boolean; data: any } } = {};
  listOfTypeProject: any[] = [];
  listOfDataTypeProject: any[] = [];

  idAddNameProject = "ADD_NAME_PROJECT";
  projecTypeOfNameProject = '';
  projecNameOfNameProject = '';
  noteOfNameProject = '';
  editCacheNameProject: { [key: string]: { edit: boolean; data: any } } = {};
  listOfNameProject: any[] = [];
  listOfDataNameProject: any[] = [];

  searchTypeProjectValue = '';
  visibleSearchTypeProject = false;

  searchNameProjectValue = '';
  visibleSearchNameProject = false;

  constructor(private httpServerService: HttpServerService,
    private message: NzMessageService,
    private fb: UntypedFormBuilder) { }

    submitFormTypeProject(): void {
      if (this.validateFormTypeProject.valid) {
        let values = this.validateFormTypeProject.value;
        this.httpServerService.createTypeProject(values.Type, values.Note)
        .subscribe(data => {
          if (data && data.success) {
            this.message.success("Tạo thành công!");
            this.listOfTypeProject = [
              ...this.listOfTypeProject,
              {
                id: this.idAddTypeProject,
                active: 1,
                note: values.Note,
                type: values.Type
              }
            ];

            this.updateCacheTypeProject();
          }
        });
      } else {
        Object.values(this.validateFormTypeProject.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

    submitFormNameProject(): void {
      if (this.validateFormNameProject.valid) {
        let values = this.validateFormNameProject.value;
        
        this.httpServerService.createNameProject(values.ProjectName, values.Note, values.ProjectType)
        .subscribe(data => {
          if (data && data.success) {
            this.message.success("Tạo thành công!");
            this.listOfNameProject = [
              ...this.listOfNameProject,
              {
                id: this.idAddNameProject,
                active: 1,
                note: values.Note,
                id_type_project: values.ProjectType,
                name_project: values.ProjectName
              }
            ];

            this.updateCacheNameProject();
          }
        });
      } else {
        Object.values(this.validateFormNameProject.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

  startEditTypeProject(id: string): void {
    this.editCacheTypeProject[id].edit = true;
  }

  cancelEditTypeProject(id: string): void {
    const index = this.listOfTypeProject.findIndex(item => item.id === id);
    this.editCacheTypeProject[id] = {
      data: { ...this.listOfTypeProject[index] },
      edit: false
    };
  }

  saveEditTypeProject(id: string): void {
    const index = this.listOfTypeProject.findIndex(item => item.id === id);
    Object.assign(this.listOfTypeProject[index], this.editCacheTypeProject[id].data);

    this.updateAdminTypeProject(this.listOfTypeProject[index]);
    this.editCacheTypeProject[id].edit = false;
  }

  updateCacheTypeProject(): void {
    this.listOfTypeProject.forEach(item => {
      this.editCacheTypeProject[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  startEditNameProject(id: string): void {
    this.editCacheNameProject[id].edit = true;
  }

  cancelEditNameProject(id: string): void {
    const index = this.listOfNameProject.findIndex(item => item.id === id);
    this.editCacheNameProject[id] = {
      data: { ...this.listOfNameProject[index] },
      edit: false
    };
  }

  saveEditNameProject(id: string): void {
    const index = this.listOfNameProject.findIndex(item => item.id === id);
    Object.assign(this.listOfNameProject[index], this.editCacheNameProject[id].data);
    
    this.updateAdminNameProject(this.listOfNameProject[index]);
    this.editCacheNameProject[id].edit = false;
  }

  updateCacheNameProject(): void {
    this.listOfNameProject.forEach(item => {
      this.editCacheNameProject[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  updateAdminNameProject(data: any): void {
    this.httpServerService.updateNameProject(data.id, data.name_project, data.note, data.id_type_project, data.active)
      .subscribe(data => {
        if (data.success) {
          this.message.success("Cập nhật thành công!");
        }
      });
  }

  ngOnInit(): void {
    this.loadingData = true;
    this.loadDataTypeProject();
    this.loadDataNameProject();
    this.initData();
    this.loadingData = false;
  }

  loadDataTypeProject(): void {
    this.httpServerService.getAdminTypeProject()
      .subscribe(data => {
        if (data.success) {
          this.filterTypeProject = [];
          data.result.forEach((element: any) => {
            this.filterTypeProject.push({ text: element.note, value: element.id });
          })
          this.listOfTypeProject = data.result;
          this.listOfDataTypeProject = [...this.listOfTypeProject]
          this.updateCacheTypeProject();
        }
      });
  }

  loadDataNameProject(): void {
    this.loadDataTypeProject();

    this.httpServerService.getAdminNameProject()
      .subscribe(data => {
        if (data.success) {
          this.listOfNameProject = data.result;
          this.listOfDataNameProject = [...this.listOfNameProject]
          this.updateCacheNameProject();
        }
      });
  }

  initData(): void {
    this.validateFormTypeProject = this.fb.group({});
    for (let i = 0; i < this.controlsTypeProject.length; i++) {
      this.controlArrayTypeProject.push({ index: i, show: true, id: this.controlsTypeProject[i].id, name: this.controlsTypeProject[i].name, placeholder: this.controlsTypeProject[i].placeholder });
      this.validateFormTypeProject.addControl(`${this.controlsTypeProject[i].id}`, new UntypedFormControl());
    }

    this.validateFormTypeProject = this.fb.group({
      Note: [null, [Validators.required]],
      Type: [null, [Validators.required]]
    });

    this.validateFormNameProject = this.fb.group({});
    for (let i = 0; i < this.controlsNameProject.length; i++) {
      this.controlArrayNameProject.push({ index: i, show: true, id: this.controlsNameProject[i].id, name: this.controlsNameProject[i].name, placeholder: this.controlsNameProject[i].placeholder, type: this.controlsNameProject[i].type ?? "default", valueSelect: this.controlsNameProject[i].valueSelect });
      this.validateFormNameProject.addControl(`${this.controlsNameProject[i].id}`, new UntypedFormControl());
    }

    this.validateFormNameProject = this.fb.group({
      ProjectType: [null, [Validators.required]],
      ProjectName: [null, [Validators.required]],
      Note: [null, [Validators.required]]
    });
  }

  updateAdminTypeProject(data: any): void {
    this.httpServerService.updateTypeProject(data.type, data.note, data.active, data.id)
      .subscribe(data => {
        if (data.success) {
          this.message.success("Cập nhật thành công!");
        }
      });
  }

  changeActive(data: any, active: number): void {
    data.data.active = active;
  }

  getValueById(list: any[], id: string): string {
    return list.filter(x => x.value == id)[0]?.text;
  }

  resetTypeProject(): void {
    this.searchTypeProjectValue = '';
    this.searchTypeProject();
  }

  searchTypeProject(): void {
    this.visibleSearchTypeProject = false;
    this.listOfDataTypeProject = this.listOfTypeProject.filter((item: any) => item.type.toLowerCase().indexOf(this.searchTypeProjectValue.toLowerCase()) !== -1);
  }

  resetNameProject(): void {
    this.searchNameProjectValue = '';
    this.searchNameProject();
  }

  searchNameProject(): void {
    this.visibleSearchNameProject = false;
    this.listOfDataNameProject = this.listOfNameProject.filter((item: any) => item.name_project.toLowerCase().indexOf(this.searchNameProjectValue.toLowerCase()) !== -1);
  }

  changeTypeProject(id: string, value: string): void {
    this.editCacheNameProject[id].data.id_type_project = value;
  }
}

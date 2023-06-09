import { Component, OnInit } from '@angular/core';

import { ColumnDef } from '@app/shared/models';
import { AppSpinnerService, TekByteApiService, TopicApiService } from '@app/core';
import { Router } from '@angular/router';
import { TekByteItem } from '@app/shared/models/tekbyte-item.model';
import { ViewChild } from '@angular/core';
import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';


@Component({
  selector: 'app-tekbyte',
  templateUrl: './tekbyte.component.html',
  styleUrls: ['./tekbyte.component.scss'],
})
export class TekByteComponent implements OnInit {
  tekByteColumns: ColumnDef[] = [
    {
      columnId: 'topicCode',
      columnName: 'Tekbyte Code',
      clazz: ['title-column', 'custom-title-col']
    },
    {
      columnId: 'category',
      columnName: 'Category'
    }, 
    {
      columnId: 'summary',
      columnName: 'Summary'
    },
    {
      columnId: 'description',
      columnName: 'Description',
      clazz: ['custom-description-col'],
    },
    {
      columnId: 'aliases',
      columnName: 'Tags',
      disableSort: true,
      columnFormatter: (tags: string[]) => {
        if (tags && typeof tags === 'object' && tags.length) {
          return tags
            .map(
              tag => `
                <span class="badge badge-pill badge-light border border-secondary rounded-pill mr-1 px-2">
                  ${tag}
                </span>`
            )
            .join('');
        } else {
          return '';
        }
      },
    },
    {
      columnId: 'status',
      columnName: 'Status',
      disableSort: true
    },
    {
      columnId: 'action',
      columnName: 'Action',
      clazz: ['action-column'],
      actionItems: [
        {
          actionId: 'edit',
          iconUrl: '/assets/images/action.svg',
          actionCallback: this.editActionCallback.bind(this),
        },
        {
          actionId: 'delete',
          iconUrl: '/assets/images/delete.svg',
          actionCallback: this.deleteActionCallback.bind(this),
        },
      ],
    },
  ];

  tekByteData: TekByteItem[] = [];
  @ViewChild('tekByteTable') tekByteTable: DataTableComponent;

  constructor(private topicApi: TopicApiService, 
    private tekbyteService: TekByteApiService,
    private spinner: AppSpinnerService,
    private router: Router) {}

  ngOnInit(): void {
    this.spinner.show();
    this.tekbyteService.getAllTekByte().subscribe(data => {
      console.log(' tek bytes', data);
      if(data) {
        this.tekByteData = data;
        this.spinner.hide();
      }
    }, error => {
      console.log('error', error);
      this.spinner.hide();
    });
  }

  editActionCallback(row: TekByteItem): void {
    sessionStorage.setItem('tekbyteCode', row.code);
    this.navigateToPage('admin/tekbyte/edittekbyte');
  }

  deleteActionCallback(row: TekByteItem): void {
    this.tekbyteService.disableTekByte(row.code).subscribe();
  }

  onSearch(event) {
    this.tekByteTable.onSearch(event.currentTarget.value);
  }
  
  navigateToPage(url: string): void {
    this.router.navigateByUrl(url);
  }
}

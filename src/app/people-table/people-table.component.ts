import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatBottomSheet } from '@angular/material';
import { DataService } from '../data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { InsertMessage } from '../messaging/InsertMessage';
import { MessagingService } from '../messaging.service';
import { PeopleDeleteComponent } from '../people-delete/people-delete.component';




@Component({
  selector: 'app-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.css']
})
export class PeopleTableComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  loading = true;
  dataSource = new MatTableDataSource<any>();

  newItemSubscription: Subscription;




  displayedColumns: string[] = ['select', 'firstName',
    'lastName', 'mobiles', 'services',
    'events', 'complaints', 'sales', 'score', 'rating', 'flagged'];

  selection = new SelectionModel<any>(true, []);

  constructor(private bottomSheet: MatBottomSheet, private messagingService: MessagingService, private dataService: DataService, private sanitizer: DomSanitizer, _matPaginatorIntl: MatPaginatorIntl) {

    _matPaginatorIntl.firstPageLabel = "اولین صفحه";
    _matPaginatorIntl.itemsPerPageLabel = "تعداد رکورد در هر صفحه";
    _matPaginatorIntl.lastPageLabel = "آخرین صفحه";
    _matPaginatorIntl.nextPageLabel = "صفحه بعد";
    _matPaginatorIntl.previousPageLabel = "صفحه قبل";
    _matPaginatorIntl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 از ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return this.rpd(startIndex + 1 + ' - ' + endIndex + ' از ' + length);
    };
  }

  ngOnDestroy() {
    this.newItemSubscription.unsubscribe();
  }

  async ngOnInit() {

    this.refresh();

    this.newItemSubscription = this.messagingService.listen({
      type: InsertMessage,
      targets: ['people']
    }, msg => {
      this.refresh();
    });


  }


  async refresh() {

    this.paginator.pageSize = 10;
    this.paginator.length = await this.dataService.count('people');
    this.paginator.page.subscribe(async (event) => {
      this.loading = true;
      this.dataSource.data = [];
      this.dataSource.data = await this.dataService.list('people', (event.pageIndex - 1) * event.pageSize, event.pageSize);
      this.loading = false;
    });
    this.dataSource.data = await this.dataService.list('people', 0, 10);
    this.loading = false;

  }

  edit(model) {

    console.log(model);
  }

  delete(model) {
    this.bottomSheet.open(PeopleDeleteComponent, { data: { model } });
    
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  rpd(input) {
    if (!input)
      input = '';
    var convert = (a) => {
      return ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'][a];
    }
    return input.toString().replace(/\d/g, convert);
  }



}

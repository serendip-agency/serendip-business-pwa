import { PeopleFormComponent } from "../people/people-form/people-form.component";
import { PeopleTableComponent } from "../people/people-table/people-table.component";
import { PeopleListComponent } from "../people/people-list/people-list.component";

export class DashboardSchema {
    private defaults = [
        {
            name: 'dashboard',
            title: 'داشبورد',
            tabs: [{
                name: 'default',
                widgets: []
            }]
        },
        {
            name: 'people',
            title: 'اشخاص',
            tabs: [
                {
                    name: 'new',
                    title: 'ثبت فرد جدید',
                    widgets: [{
                        inputs: {},
                        component: PeopleFormComponent
                    }]
                },
                {
                    name: 'edit',
                    showInNav : false,
                    widgets: [{
                        inputs: {},
                        component: PeopleFormComponent
                    }]
                },
                {
                    name: 'data',
                    title: 'لیست',
                    widgets: [{
                        inputs: {},
                        component: PeopleTableComponent,
                        screen : 'desktop'
                    },
                    {
                        inputs: {},
                        component: PeopleListComponent,
                        screen : 'mobile'
                    }]
                }
            ]
        }];

    get current() {
        return this.defaults;
    }

}



import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-preps',
  templateUrl: 'preps.page.html',
  styleUrls: ['preps.page.scss',
              '../../../node_modules/@swimlane/ngx-datatable/assets/icons.css']
})
export class PrepsPage implements OnInit {

  @ViewChild('dnChart', {static:false}) dnChart: ElementRef;
  rows: Object;
  dn: Chart;
  tablestyle = 'bootstrap';

  prepTotal = 132545535;

  constructor() {}

  ngAfterViewInit() {
     this.createDnChart();
  }

  ngOnInit(){
    this.rows = [
      {
        "rank": '#2',
        "name": "Ubik",
        "production": "0/0",
        "votes": "13.6% / 13,545,552"
      },
      {
        "rank": '#4',
        "name": "ICONation",
        "production": "0/0",
        "votes": "9.7% / 10,256,556"
      },
      {
        "rank": "#5",
        "name": "RHIZOME",
        "production": "0/0",
        "votes": "8.1% / 9,654,225"
      }
    ];
  }


  createDnChart() {
    this.dn = new Chart(this.dnChart.nativeElement, {
      type: 'pie',
      circumference: Math.PI,
      data: {
        labels: ['ICONation','Rhizome','Ubik'],
        datasets: [{
          label: '',
          data: [4000,25332,10233],
          backgroundColor: [
            '#729192',
            '#84d4d6',
            '#545454'
          ],
          borderColor: [
            '#e9e9e9',
            '#e9e9e9',
            '#e9e9e9'
          ],
          borderWidth: 1
        }]
      }, 
      options: {
        legend: {
          display: true,
          position: 'right',
          fullWidth: false,
          labels: {
            fontSize: 8,
            boxWidth: 10,
            defaultFontFamily: "'Open Sans',  sans-serif"
          }
        },
      cutoutPercentage: 10,
      layout: {
        padding: {
            left: 0,
            right: 80,
            top: 0,
            bottom: 0
        }
      },
      responsive: true,
      plugins: {
          labels: [
            {
              render: 'value',
              position: 'outside',
              fontColor: '#1f2120',
              fontSize: 8
            },
            {
              render: 'percentage',
              fontColor: '#fff',
              fontSize: 8
            }
          ]
        }
      }
    });
  }
}

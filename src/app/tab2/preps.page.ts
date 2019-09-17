import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import IconService, { HttpProvider, IconBuilder, IconConverter, IconAmount  } from 'icon-sdk-js';
const { CallBuilder } = IconBuilder;
import { Chart, ChartModule } from 'chart.js';
import 'chartjs-plugin-labels';

@Component({
  selector: 'app-preps',
  templateUrl: 'preps.page.html',
  styleUrls: ['preps.page.scss']
})
export class PrepsPage implements OnInit {

  @ViewChild('dnChart', {static:false}) dnChart: ElementRef;

  dn: Chart;

  constructor() {}

  ngAfterViewInit() {
     this.createDnChart();
  }

  ngOnInit(){

  }


  createDnChart() {
    this.dn = new Chart(this.dnChart.nativeElement, {
      type: 'pie',
      circumference: Math.PI,
      data: {
        labels: ['ICONation','Ubik','Rhizome'],
        datasets: [{
          label: '',
          data: [400,25332,10233],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            '#32b8bb',
            '#545454'
          ],
          borderColor: [
            '#000',
            '#000',
            '#000'
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
            boxWidth: 10
          }
        },
        animation: {
          animateRotate: true
        },
      cutoutPercentage: 0,
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
              fontColor: '#000',
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

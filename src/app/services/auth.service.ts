import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = {
    user: {
      usuario: '',
      user_id: '',
      desc_catalogo: '',
      org_id: '',
    },
    token: '',
    versions: {
      api: '',
    },
  };
  orgSelected = {
    org_id: '',
  };
  mode = '';
  public menuItems = [
    {
      label: 'Documentos',
      icon: 'folder',
      link: '',
      view: false,
      isOpen: false,
      margin: '270px',
      subItems: [
        {
          label: 'Factura',
          icon: 'document',
          link: '/facturas',
          id: '1',
        },
        {
          label: 'Nota de Crédito',
          icon: 'document',
          link: '/nota-credito',
          id: '2',
        },
        {
          label: 'Nota de Débito',
          icon: 'document',
          link: '/nota-debito',
          id: '3',
        },
        {
          label: 'Orden de Entrega',
          icon: 'document',
          link: '/orden-entrega',
          id: '4',
        },
        {
          label: 'Guía de Despacho',
          icon: 'document',
          link: '/guia-despacho',
          id: '5',
        },
      ],
    },
    {
      label: 'Comp. Retención',
      icon: 'document-attach',
      link: '',
      view: false,
      isOpen: false,
      margin: '120px',
      subItems: [
        {
          label: 'IVA',
          icon: 'document',
          link: '/comp-iva',
          id: '6',
        },
        // { label: 'Intentos fallidos', icon: 'close', link: '/view-rep-failet-attempts',id: '5' },
        {
          label: 'ISLR',
          icon: 'document',
          link: '/comp-islr',
          id: '7',
        },
        // { label: 'Ventas', icon: 'card', link: '/view-rep-sales',id: '7' },
      ],
    },
    {
      label: 'Reportes',
      icon: 'podium',
      link: '',
      isOpen: false,
      margin: '150px',
      view: false,
      subItems: [
        {
          label: 'Peticiones recibidas',
          icon: 'document',
          link: '/view-rep-document-sent',
          id: '8',
        },
        {
          label: 'Numeros Control Emitidos',
          icon: 'cloud-upload',
          //link: '/nmr-control-asignados',
          link: '',
          id: '9',
          margin: '600px',
          view: false,
          isOpen: false,
          subItems: [
            // {
            //   label: 'Anual resumido',
            //   icon: 'document',
            //   link: '/nmr-control-asignados',
            //   id: '100',
            // },
            // {
            //   label: 'Anual por rango',
            //   icon: 'document',
            //   link: '/nmr-control-asignados',
            //   id: '101',
            // },
            {
              label: 'Anual resumido',
              icon: 'document',
              link: '/nmr-control-asignados',
              id: '102',
            },
            {
              label: 'Mensual resumido',
              icon: 'close',
              link: '/nmr-control-asignados',
              id: '103',
            },
            // {
            //   label: 'Mensual por rango',
            //   icon: 'close',
            //   link: '/nmr-control-asignados',
            //   id: '104',
            // },
            // {
            //   label: 'Mensual por semana',
            //   icon: 'close',
            //   link: '/nmr-control-asignados',
            //   id: '105',
            // },
            {
              label: 'Semanal resumido',
              icon: 'close',
              link: '/nmr-control-asignados',
              id: '106',
            },
            // {
            //   label: 'Semanal por rango',
            //   icon: 'close',
            //   link: '/nmr-control-asignados',
            //   id: '107',
            // },
            // {
            //   label: 'Semanal por dia',
            //   icon: 'close',
            //   link: '/nmr-control-asignados',
            //   id: '108',
            // },
          ],
        },
        {
          label: 'Nmr. Control Vendidos',
          icon: '',
          link: '/nmr-control-vendidos',
          id: '10',
        },
        {
          label: 'Emisores en producción',
          icon: 'play-skip-forward-circle',
          link: '/nmr-control-asignados',
          id: '109',
        },
        {
          label: 'PROVIDENCIA 0032',
          icon: 'play-skip-forward-circle',
          link: '/nmr-control-asignados',
          id: '110',
        },
        // { label: 'Ventas', icon: 'card', link: '/view-rep-sales',id: '7' },
      ],
    },
    {
      label: 'Libro de venta',
      icon: 'book',
      link: '/libro-venta',
      id: '11',
      isOpen: false,
      subItems: [],
    },
    {
      label: 'Asig. contribuyentes',
      icon: 'grid',
      link: '',
      view: false,
      subItems: [
        {
          label: 'Iniciar',
          icon: 'checkmark-done-outline',
          link: '/view-start-assignment',
          id: '12',
        },
        {
          label: 'Incrementar',
          icon: 'duplicate-outline',
          link: '/view-increase-assignment',
          id: '13',
        },

        {
          label: 'registrar',
          icon: 'add-outline',
          link: '/view-register-assigment',
          id: '14',
        },
        // {
        //   label: 'Asignación S/P',
        //   icon: 'trending-down-outline',
        //   link: '/view-assign-sp',
        //   id: '14',
        // },
      ],
      isOpen: false,
      margin: '170px',
    },

    {
      label: 'Usuarios',
      icon: 'body',
      link: '/view-user',
      subItems: [],
      isOpen: false,
      view: false,
      id: '15',
    },
    {
      label: 'Organizaciones',
      icon: 'people',
      link: '/view-bpartner',
      subItems: [],
      isOpen: false,
      view: false,
      id: '16',
    },
    {
      label: 'Auditoria',
      icon: 'eye',
      link: '/view-audit',
      subItems: [],
      isOpen: false,
      view: false,
      id: '17',
    },
    {
      label: 'Salir',
      icon: 'log-out-outline',
      link: '/select-mode',
      subItems: [],
      isOpen: false,
      view: true,
      id: '99',
    },
  ];
  selectedMenuItem = {
    id: '',
    label: '',
  };
  public filterMenu: any = [];
  constructor(public router: Router) {}
  logout() {
    this.user = {
      user: {
        usuario: '',
        user_id: '',
        desc_catalogo: '',
        org_id: '',
      },
      token: '',
      versions: {
        api: '',
      },
    };
    this.router.navigate(['/login']);
  }
}

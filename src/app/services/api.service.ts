import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DataService } from './data.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //dataApi:any = localStorage.getItem('ipServiceSpartanPos');
  // ? VARIABLES
  apiService: any = {
    api_url: 'www.demoapiportal.abcdigitalprinting.com',
    //api_url: '10.10.0.66',
    api_port: '',
  };
  endpoint = {
    bpartner: 'filter/tercero',
    login: 'portal/login',
    insert: 'insert/table',
    invoice: {
      purchase: 'invoice',
      sales: 'invoice',
    },
    documents: 'documento',
    getAllDocument: 'portal/selectAll/Documentos',
    getAllDocumentLibroVenta: 'portal/selectAll/Documentos/libroDeVentas',
    getAllOrg: 'portal/selectAll/orgs',
    getAllUser: 'portal/selectAll/users',
    createOrg: 'portal/insert/org',
    createSequence: 'portal/insert/sequence',
    catalog: 'filter/catalogo',
    sequences: 'filter/sequence',
    sequencesChilds: 'filter/sequence_child',
    getSequenceChildBySequence: 'portal/sequence_childByFather/',
    serie: 'filter/serie',
    user: 'filter/user',
    createSerie: 'portal/insert/serie',
    createSequenceChild: 'portal/insert/sequenceChild',
    createuser: 'portal/insert/user',
    getAllDocumentReceived: 'portal/DocRecibidos',
    org: 'portal/filter/org',
    getAllLinesByDocument: 'portal/selectAll/linesByDocument/',
    recuperar: `https://${this.apiService.api_url}/recuperar`,
    sendDocument: `https://${this.apiService.api_url}/enviar`,
    asignacionContribuyente: `portal/insert/asignacion_contribuyente`,
    incrementarAsignacionContribuyente: `portal/increment/asignacion_contribuyente`,
    registrarAsignacionContribuyente: `portal/register/asignacion_contribuyente`,
    procesarAsignacionContribuyente: `portal/procesar/asignacion_contribuyente`,
    filterAsignacionContribuyente: `filter/asignacion_contribuyente`, // asignacion de la imprenta a cliente
    auditHistory: `filter/audit_history`,
    documentPDF: `portal/pdf/`,
    reporteConsumidos: 'portal/reporte/consumidos',
    reporteConsumidosProvidencia: 'portal/reporte/providencia',
  };
  loadedData: any = {
    //? ---- FILES ---- ?\\
    bpartner: {
      source: [],
      ids: [],
      defaultIdentifier: 'bpartner_id',
      clusterIdentifier: 'bpartners',
    },
    serie: {
      source: [],
      ids: [],
      defaultIdentifier: 'serie_id',
      clusterIdentifier: 'series',
    },
    product: {
      source: [],
      ids: [],
      defaultIdentifier: 'product_id',
      clusterIdentifier: 'products',
    },
    productCategory: {
      source: [],
      ids: [],
      defaultIdentifier: 'product_category_id',
      clusterIdentifier: 'product_categorys',
    },
    uom: {
      source: [],
      ids: [],
      defaultIdentifier: 'uom_id',
      clusterIdentifier: 'uoms',
    },
    warehouse: {
      source: [],
      ids: [],
      defaultIdentifier: 'warehouse_id',
      clusterIdentifier: 'warehouses',
    },

    //? ---- PROCESS ---- ?\\

    //? ---- BUSINESS ---- ?\\
    paymentMethod: {
      source: [],
      ids: [],
      defaultIdentifier: 'paymentmethod_id',
      clusterIdentifier: 'paymentmethods',
    },
    paymentTerm: {
      source: [],
      ids: [],
      defaultIdentifier: 'paymentterm_id',
      clusterIdentifier: 'paymentterms',
    },
    taxCategory: {
      source: [],
      ids: [],
      defaultIdentifier: 'taxcategory_id',
      clusterIdentifier: 'taxcategorys',
    },
    tax: {
      source: [],
      ids: [],
      defaultIdentifier: 'tax_id',
      clusterIdentifier: 'taxs',
    },
    financialAccount: {
      source: [],
      ids: [],
      defaultIdentifier: 'financial_account_id',
      clusterIdentifier: 'financial_accounts',
    },
    //? ---- DEFINITIONS ---- ?\\
    org: {
      source: [],
      ids: [],
      defaultIdentifier: 'org_id',
      clusterIdentifier: 'orgs',
    },
    currency: {
      source: [],
      ids: [],
      defaultIdentifier: 'currency_id',
      clusterIdentifier: 'currencys',
    },

    sequence: {
      source: [],
      ids: [],
      defaultIdentifier: 'sequence_id',
      clusterIdentifier: 'sequences',
    },
    user: {
      source: [],
      ids: [],
      defaultIdentifier: 'user_id',
      clusterIdentifier: 'user',
    },
    documentType: {
      source: [],
      ids: [],
      defaultIdentifier: 'doctype_id',
      clusterIdentifier: 'doctypes',
    },
    comprador: {
      source: [],
      ids: [],
      defaultIdentifier: 'comprador_id',
      clusterIdentifier: 'compradors',
    },
    tercero: {
      source: [],
      ids: [],
      defaultIdentifier: 'tercero_id',
      clusterIdentifier: 'terceros',
    },
  };

  constructor(
    public http: HttpClient,
    private servData: DataService,
    private configService: ConfigService
  ) {
    // setTimeout(() => {
    //   this.apiService = this.configService.getApiUrl();
    // }, 1000);
  }
  // ? GENERAL
  // ? IPS AND URL
  private addIP(_url: any) {
    const ip = `https://${this.apiService.api_url}${this.apiService.api_port}`;

    return (_url = `${ip}/${_url}`);
  }
  formatFilter(_filter: any) {
    const keys = Object.keys(_filter.columns);

    let filterFormat: any = {
      index: _filter.index,
      itemsByPage: _filter.itemsByPage,
      count: _filter.count,
      orderBy: _filter.orderBy,
      columns: {
        ..._filter.columns,
      },
      ignore: {
        ..._filter.columns,
      },
    };

    keys.forEach((key: any) => {
      filterFormat.columns[key] = formatLine_columns(
        filterFormat.columns[key],
        key
      );
      filterFormat.ignore[key] = formatLine_ignore(
        filterFormat.ignore[key],
        key
      );
    });

    return filterFormat;

    function formatLine_columns(_value: any, _key: any) {
      if (_filter.excluded_columns?.includes(_key)) {
        return [''];
      }

      if (_filter.boolean_columns.includes(_key)) {
        return _value == 'null' || _value == null
          ? null
          : _value == true || _value == 'true'
          ? true
          : false;
      }

      if (_filter.date_columns.includes(_key)) {
        const FOUR_HOURS = 0;
        const TO_MIDNIGHT = 0;

        if (_value !== null)
          return [
            { operate: '>', value: _value.start - FOUR_HOURS },
            {
              operate: '<',
              value: _value.end + TO_MIDNIGHT - FOUR_HOURS,
            },
          ];
        else return null;
      }

      //

      if (_filter.numeric_columns.includes(_key)) {
        return divideNumercLine(_value);
      }

      if (Array.isArray(_value)) return _value;

      let values = divideLine(_value);

      values = values.map((value: any) => value.trim());

      return values.filter((item: any) => {
        if (!item.includes('--')) return item;
      });
    }

    function formatLine_ignore(_value: String, _key: string): any {
      if (_filter.date_columns.includes(_key)) return null;
      if (_filter.boolean_columns.includes(_key)) return null;
      if (_filter.numeric_columns.includes(_key)) return null;

      if (Array.isArray(_value)) return [];

      let values = divideLine(_value);

      values = values.map((value: any) => value.trim());

      values = values.filter((item: any) => {
        if (item.includes('--')) return item;
      });

      return values.map((value: String) => value.substring(2));
    }

    function divideLine(_value: String = '') {
      let itemValues: any[] = [];
      let valueAux = '';

      for (let i = 0; i <= _value.length; i++) {
        const char = _value[i];

        if (!_value.includes(',')) {
          return [_value];
        } else {
          if (char == ',' || char == undefined) {
            itemValues.push(valueAux);

            valueAux = '';
          } else {
            valueAux += char;
          }
        }
      }

      return itemValues;
    }

    function divideNumercLine(_value: String) {
      let itemValues: any[] = [];
      let valueAux = '';

      let validOperators: any[] = ['>=', '<=', '=='];

      for (let i = 0; i <= _value.length; i++) {
        const char = _value[i];
        if (!_value.includes('/')) {
          itemValues = [_value];
        } else {
          if (char == '/' || char == undefined) {
            itemValues.push(valueAux);
            valueAux = '';
          } else {
            valueAux += char;
          }
        }
      }

      let aux = itemValues.map((item: string) => {
        if (item.length <= 1) {
          return {
            operate: null,
            value: null,
          };
        }

        return {
          operate: validOperators.includes(item.substring(0, 2))
            ? item.substring(0, 2)
            : null,
          value: !Number.isNaN(Number(item.substring(2)))
            ? Number(item.substring(2))
            : null,
        };
      });

      return aux;
    }
  }

  extracMissingIDs(
    _collectionRef: string,
    _source: any[],
    _searchIdentifier?: string
  ): any[] {
    let collection: any[] = [];

    _source.forEach((item: any) => {
      collection = [
        ...collection,
        item[
          _searchIdentifier
            ? _searchIdentifier
            : this.loadedData[_collectionRef].defaultIdentifier
        ],
      ];
    });

    collection = [...new Set(collection)];

    return collection.filter((id: any) => {
      if (!this.loadedData[_collectionRef].ids.includes(id)) {
        this.loadedData[_collectionRef].ids.push(id);

        return id;
      }
    });
  }

  public getCluster(_data: any) {
    return this.executePostQuery('cluster', _data);
  }

  public getReverseCluster(_data: any) {
    console.log('data cluster =>', _data);

    return this.executePostQuery('reverseCluster', _data);
  }

  public getAuxiliarFormData(_url: string) {
    return this.executeGetQuery(`auxiliardata/${_url}`);
  }
  private formatReverseCluster(_data: any) {
    let reserveClusterFormat: any = {};

    _data.forEach((objet: any) => {
      reserveClusterFormat[
        `${this.loadedData[objet.collection].clusterIdentifier}`
      ] = {};

      reserveClusterFormat[
        `${this.loadedData[objet.collection].clusterIdentifier}`
      ][objet.column] = [objet.value];
    });
    console.log('MANDANDO AL REVERSE CLUSTER =>', reserveClusterFormat);

    return reserveClusterFormat;
  }

  private addOffsetLimit(_url: any, _offset: number, _limit: number) {
    _url += `/offset/${_offset}/limit/${_limit}`;

    return _url;
  }
  private urlCompleteFormat(_url: any): string {
    _url = this.addIP(_url);
    //_url = this.addOffsetLimit(_url, 0, 100000);

    return _url;
  }

  // ? GET QUERY
  private executeGetQuery(_url: string) {
    return this.http.get(_url);
  }

  public executePostQuery(_endpoint: string, _item: any) {
    const url = this.urlCompleteFormat(_endpoint);
    return this.http.post(url, _item);
  }
  public executePutQuery(_endpoint: string, _item: any) {
    _endpoint = this.addIP(_endpoint);

    return this.http.put(_endpoint, _item);
  }
  // ! QUERYS INSERT
  public async setNewItem(_objet: any) {
    return this.executePostQuery(this.endpoint.insert, _objet);
  }

  public async setPutItem(_objet: any) {
    return this.executePutQuery(`update/table`, _objet);
  }

  // !
  // ! QUERYS POST

  // ? LOGIN
  public postLogin(_objet: any) {
    return this.executePostQuery(this.endpoint.login, _objet);
  }
  public getAllDocument(_objet: any) {
    return this.executePostQuery(this.endpoint.getAllDocument, _objet);
  }
  public getAllDocumentReceived(_objet: any) {
    return this.executePostQuery(this.endpoint.getAllDocumentReceived, _objet);
  }
  public getAllDocumentLibroVenta(_objet: any) {
    return this.executePostQuery(
      this.endpoint.getAllDocumentLibroVenta,
      _objet
    );
  }
  // ? CREATE ORG
  public createorg(_objet: any) {
    return this.executePostQuery(this.endpoint.createOrg, _objet);
  }
  // ? CREATE SEQUENCE
  public createSequence(_objet: any) {
    return this.executePostQuery(this.endpoint.createSequence, _objet);
  }
  // ? CREATE SERIE
  public createSerie(_objet: any) {
    return this.executePostQuery(this.endpoint.createSerie, _objet);
  }
  // ? CREATE sequence hija
  public createSequenceChild(_objet: any) {
    return this.executePostQuery(this.endpoint.createSequenceChild, _objet);
  }
  // ? CREATE user
  public createUser(_objet: any) {
    return this.executePostQuery(this.endpoint.createuser, _objet);
  }
  public sendEmail(_objet: any) {
    return this.http.post(this.endpoint.sendDocument, _objet).subscribe(
      (res: any) => {},
      (error) => {}
    );
  }
  public asignacionContribuyente(_objet: any) {
    return this.executePostQuery(this.endpoint.asignacionContribuyente, _objet);
  }
  public incrementarAsignacionContribuyente(_objet: any) {
    return this.executePostQuery(
      this.endpoint.incrementarAsignacionContribuyente,
      _objet
    );
  }
  public registrarAsignacionContribuyente(_objet: any) {
    return this.executePostQuery(
      this.endpoint.registrarAsignacionContribuyente,
      _objet
    );
  }
  public procesarAsignacionContribuyente(_objet: any) {
    return this.executePostQuery(
      this.endpoint.procesarAsignacionContribuyente,
      _objet
    );
  }
  public getReportConsumido(_objet: any) {
    return this.executePostQuery(this.endpoint.reporteConsumidos, _objet);
  }
  public getReportConsumidoProvidencia(_objet: any) {
    return this.executePostQuery(
      this.endpoint.reporteConsumidosProvidencia,
      _objet
    );
  }
  // ! QUERYS GET
  public getAllOrgs() {
    const url = this.urlCompleteFormat(this.endpoint.getAllOrg);
    return this.executeGetQuery(url);
  }
  public getAllUsers() {
    const url = this.urlCompleteFormat(this.endpoint.getAllUser);
    return this.executeGetQuery(url);
  }
  public getSequencesChildsBySequence(_objet: any) {
    return this.executePostQuery(
      this.endpoint.getSequenceChildBySequence,
      _objet
    );
  }
  public getAllLinesByDocument(_objet: any) {
    return this.executePostQuery(this.endpoint.getAllLinesByDocument, _objet);
  }
  public getDocumentPdf(_objet: any) {
    return this.executePostQuery(this.endpoint.documentPDF, _objet);
  }

  // !

  // ! FILTERS

  public getBpartners_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(`/${this.endpoint.bpartner}`, _filter).subscribe(
      (resp: any) => {
        const orgCollection: any[] = this.extracMissingIDs('org', resp.items);

        this.servData.updateBpartners(resp);
      }
    );
  }
  //? filter org
  public getOrgs_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(`${this.endpoint.org}`, _filter).subscribe(
      (resp: any) => {
        this.servData.updateOrgs(resp);
      }
    );
  }
  // ? sales invoice
  public getInvoiceSale_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
      // for (const key in object) {
      //   if (Object.prototype.hasOwnProperty.call(object, key)) {
      //     const element = object[key];

      //   }
      // }
    }

    this.executePostQuery(
      `filter/${this.endpoint.invoice.purchase}`,
      _filter
    ).subscribe((resp: any) => {
      const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
      const bpartnerCollection: any[] = this.extracMissingIDs(
        'bpartner',
        resp.items
      );
      // const warehouseCollection: any[] = this.extracMissingIDs(
      //   'warehouse',
      //   resp.items
      // );
      // const pricelistCollection: any[] = this.extracMissingIDs(
      //   'pricelist',
      //   resp.items
      // );
      const doctypeCollection: any[] = this.extracMissingIDs(
        'documentType',
        resp.items
      );

      this.getCluster({
        orgs: orgCollection.length > 0 ? orgCollection : [],
        bpartners: bpartnerCollection.length > 0 ? bpartnerCollection : [],
        // warehouses: warehouseCollection.length > 0 ? warehouseCollection : [],
        // pricelists: pricelistCollection.length > 0 ? pricelistCollection : [],
        doctypes: doctypeCollection.length > 0 ? doctypeCollection : [],
      }).subscribe((respCluster: any) => {
        resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
          {
            collection: 'org',
            identifier: 'org_id',
            source: respCluster.orgs != null ? respCluster.orgs : [],
          },
          {
            collection: 'bpartner',
            identifier: 'bpartner_id',
            source: respCluster.bpartners != null ? respCluster.bpartners : [],
          },
          // {
          //   collection: 'warehouse',
          //   identifier: 'warehouse_id',
          //   source:
          //     respCluster.warehouses != null ? respCluster.warehouses : [],
          // },
          // {
          //   collection: 'pricelist',
          //   identifier: 'pricelist_id',
          //   source:
          //     respCluster.pricelists != null ? respCluster.pricelists : [],
          // },
          {
            collection: 'documentType',
            identifier: 'doctype_id',
            source: respCluster.doctypes != null ? respCluster.doctypes : [],
          },
        ]);

        this.servData.updateInvoiceSales(resp);
      });
    });
  }
  public getInvoiceSales_byAuxiliarFilter(_filter: any, _options?: any) {
    const auxiliarColumn_toSearch: any[] = _filter.auxiliar.filter(
      (aux: any) => aux.value != ''
    );

    if (auxiliarColumn_toSearch.length > 0) {
      this.getReverseCluster(
        this.formatReverseCluster(auxiliarColumn_toSearch)
      ).subscribe((resp: any) => {
        auxiliarColumn_toSearch.forEach((item: any) => {
          _filter.columns[item.tableIdentifier] =
            resp[this.loadedData[item.collection].clusterIdentifier];
        });

        this.getAllDocuments_byFilter(_filter, _options);
      });
    } else {
      this.getInvoiceSale_byFilter(_filter, _options);
    }
  }
  // ? DOCUMENTS
  public getAllDocuments_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
    }

    this.executePostQuery(
      `/portal/filter/${this.endpoint.documents}`,
      _filter
    ).subscribe((resp: any) => {
      console.log('RESP =>', resp);

      const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
      const compradorCollection: any[] = this.extracMissingIDs(
        'comprador',
        resp.items
      );
      const terceroCollection: any[] = this.extracMissingIDs(
        'tercero',
        resp.items
      );
      // const pricelistCollection: any[] = this.extracMissingIDs(
      //   'pricelist',
      //   resp.items
      // );
      // const doctypeCollection: any[] = this.extracMissingIDs(
      //   'documentType',
      //   resp.items
      // );
      this.getCluster({
        orgs: orgCollection.length > 0 ? orgCollection : [],
        compradors: compradorCollection.length > 0 ? compradorCollection : [],
        terceros: terceroCollection.length > 0 ? terceroCollection : [],
        // pricelists: pricelistCollection.length > 0 ? pricelistCollection : [],
        //   doctypes: doctypeCollection.length > 0 ? doctypeCollection : [],
      }).subscribe((respCluster: any) => {
        resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
          {
            collection: 'org',
            identifier: 'org_id',
            source: respCluster.orgs != null ? respCluster.orgs : [],
          },
          {
            collection: 'comprador',
            identifier: 'comprador_id',
            source:
              respCluster.compradors != null ? respCluster.compradors : [],
          },
          {
            collection: 'tercero',
            identifier: 'tercero_id',
            source: respCluster.terceros != null ? respCluster.terceros : [],
          },
        ]);
        this.servData.updateDocuments(resp);
      });
    });
  }

  public getDocuments_byAuxiliarFilter(_filter: any, _options?: any) {
    console.log('filter auxiliar =>', _filter.auxiliar);

    const auxiliarColumn_toSearch: any[] = _filter.auxiliar.filter(
      (aux: any) => aux.value != ''
    );
    console.log('DESPUES CLUSTER =>', auxiliarColumn_toSearch);

    if (auxiliarColumn_toSearch.length > 0) {
      this.getReverseCluster(
        this.formatReverseCluster(auxiliarColumn_toSearch)
      ).subscribe((resp: any) => {
        console.log('RESP CLUSTER =>', resp);

        auxiliarColumn_toSearch.forEach((item: any) => {
          _filter.columns[item.tableIdentifier] =
            resp[this.loadedData[item.collection].clusterIdentifier];
        });

        this.getAllDocuments_byFilter(_filter, _options);
      });
    } else {
      this.getAllDocuments_byFilter(_filter, _options);
    }
  }
  // ? catalog
  public getCatalog_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(`portal/${this.endpoint.catalog}`, _filter).subscribe(
      (resp: any) => {
        const orgCollection: any[] = this.extracMissingIDs('org', resp.items);

        // this.getCluster({
        //   orgs: orgCollection.length > 0 ? orgCollection : [],

        // }).subscribe((respCluster: any) => {
        //   resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
        //     {
        //       collection: 'org',
        //       identifier: 'org_id',
        //       source: respCluster.orgs != null ? respCluster.orgs : [],
        //     },
        //   ]);

        this.servData.updateCatalogs(resp);
        // });
      }
    );
  }
  // ? sequence
  public getSequences_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(
      `portal/${this.endpoint.sequences}`,
      _filter
    ).subscribe((resp: any) => {
      const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
      const sequenceCollection: any[] = this.extracMissingIDs(
        'sequence',
        resp.items
      );
      const serieCollection: any[] = this.extracMissingIDs('serie', resp.items);
      this.getCluster({
        orgs: orgCollection.length > 0 ? orgCollection : [],
        sequences: sequenceCollection.length > 0 ? sequenceCollection : [],
        series: serieCollection.length > 0 ? serieCollection : [],
      }).subscribe((respCluster: any) => {
        resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
          {
            collection: 'org',
            identifier: 'org_id',
            source: respCluster.orgs != null ? respCluster.orgs : [],
          },
          {
            collection: 'sequence',
            identifier: 'sequence_id',
            source: respCluster.sequences != null ? respCluster.sequences : [],
          },
          {
            collection: 'serie',
            identifier: 'serie_id',
            source: respCluster.series != null ? respCluster.series : [],
          },
        ]);

        this.servData.updateSequences(resp);
      });
    });
  }
  // ? sequence childs
  public getSequencesChilds_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(
      `portal/${this.endpoint.sequencesChilds}`,
      _filter
    ).subscribe((resp: any) => {
      // this.getCluster({

      // }).subscribe((respCluster: any) => {
      //   resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
      //     {
      //       collection: 'org',
      //       identifier: 'org_id',
      //       source: respCluster.orgs != null ? respCluster.orgs : [],
      //     },
      //     {
      //       collection: 'sequence',
      //       identifier: 'sequence_id',
      //       source: respCluster.sequences != null ? respCluster.sequences : [],
      //     },
      //   ]);

      this.servData.updateSequencesChilds(resp);
      //});
    });
  }
  // ? serie
  public getSeries_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(`portal/${this.endpoint.serie}`, _filter).subscribe(
      (resp: any) => {
        const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
        const serieCollection: any[] = this.extracMissingIDs(
          'serie',
          resp.items
        );

        this.getCluster({
          orgs: orgCollection.length > 0 ? orgCollection : [],
          series: serieCollection.length > 0 ? serieCollection : [],
        }).subscribe((respCluster: any) => {
          resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
            {
              collection: 'org',
              identifier: 'org_id',
              source: respCluster.orgs != null ? respCluster.orgs : [],
            },
            {
              collection: 'serie',
              identifier: 'serie_id',
              source: respCluster.series != null ? respCluster.series : [],
            },
          ]);

          this.servData.updateSeries(resp);
        });
      }
    );
  }
  public getUsers_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      _filter.ignore['invoice_id'] = _options.ignores['invoice_id'];

      _filter.ignore['doctype_id'] = _options.ignores['doctype_id'];

      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(`portal/${this.endpoint.user}`, _filter).subscribe(
      (resp: any) => {
        const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
        const serieCollection: any[] = this.extracMissingIDs(
          'serie',
          resp.items
        );

        this.getCluster({
          orgs: orgCollection.length > 0 ? orgCollection : [],
          series: serieCollection.length > 0 ? serieCollection : [],
        }).subscribe((respCluster: any) => {
          resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
            {
              collection: 'org',
              identifier: 'org_id',
              source: respCluster.orgs != null ? respCluster.orgs : [],
            },
            {
              collection: 'serie',
              identifier: 'serie_id',
              source: respCluster.series != null ? respCluster.series : [],
            },
          ]);

          this.servData.updateUsers(resp);
        });
      }
    );
  }
  // ? filter start contribuyente
  public getStartContribuyente_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(
      `portal/${this.endpoint.filterAsignacionContribuyente}`,
      _filter
    ).subscribe((resp: any) => {
      const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
      const sequenceCollection: any[] = this.extracMissingIDs(
        'sequence',
        resp.items
      );
      this.getCluster({
        orgs: orgCollection.length > 0 ? orgCollection : [],
        sequences: sequenceCollection.length > 0 ? sequenceCollection : [],
      }).subscribe((respCluster: any) => {
        resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
          {
            collection: 'org',
            identifier: 'org_id',
            source: respCluster.orgs != null ? respCluster.orgs : [],
          },
          {
            collection: 'sequence',
            identifier: 'sequence_id',
            source: respCluster.sequences != null ? respCluster.sequences : [],
          },
        ]);

        this.servData.updateStartContribuyente(resp);
      });
    });
  }

  // ? filter audit
  // ? filter start contribuyente
  public getAuditHistory_byFilter(_filter: any, _options?: any) {
    _filter = this.formatFilter(_filter);

    if (_options) {
      // ! para compaginar dos parametros ingorados (uno natural _> del usuario, otro artificial)
    }

    this.executePostQuery(
      `portal/${this.endpoint.auditHistory}`,
      _filter
    ).subscribe((resp: any) => {
      const orgCollection: any[] = this.extracMissingIDs('org', resp.items);
      const userCollection: any[] = this.extracMissingIDs('user', resp.items);
      this.getCluster({
        orgs: orgCollection.length > 0 ? orgCollection : [],
        users: userCollection.length > 0 ? userCollection : [],
      }).subscribe((respCluster: any) => {
        resp.items = this.formatSourceWithAuxiliarColums(resp.items, [
          {
            collection: 'org',
            identifier: 'org_id',
            source: respCluster.orgs != null ? respCluster.orgs : [],
          },
          {
            collection: 'user',
            identifier: 'user_id',
            source: respCluster.users != null ? respCluster.users : [],
          },
        ]);

        this.servData.updateAuditHistory(resp);
      });
    });
  }
  // !

  // ! LOAD AUXILIARS

  formatSourceWithAuxiliarColums(_listSource: any[], _toAssemble: any[]) {
    _toAssemble.forEach(
      (assemble: { collection: string; identifier: string; source: any[] }) => {
        this.loadedData[assemble.collection].source.push(...assemble.source);

        _listSource.forEach((listItem: any) => {
          this.loadedData[assemble.collection].source.forEach(
            (loadedItem: any) => {
              if (
                listItem[assemble.identifier] ==
                loadedItem[
                  this.loadedData[assemble.collection].defaultIdentifier
                ]
              ) {
                listItem[`${assemble.identifier}_src`] = loadedItem;
              }
            }
          );
        });
      }
    );

    return _listSource;
  }
}

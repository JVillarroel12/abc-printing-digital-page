import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  //? ---- invoiceSalesHeadless
  public invoiceSalesHeadlessList: any[] = [];
  private invoiceSalesHeadlessListSubject = new BehaviorSubject<any[]>([]);

  public subscribeInvoiceSales(): Observable<any[]> {
    return this.invoiceSalesHeadlessListSubject.asObservable();
  }

  public updateInvoiceSales(_source: any) {
    this.invoiceSalesHeadlessList = _source.items;

    this.invoiceSalesHeadlessListSubject.next(this.invoiceSalesHeadlessList);
  }

  // ? DOCUMENTS
  public documents: any[] = [];
  private documentsSubject = new BehaviorSubject<any[]>([]);

  public subscribeDocuments(): Observable<any[]> {
    return this.documentsSubject.asObservable();
  }

  public updateDocuments(_source: any) {
    this.documents = _source.items;

    this.documentsSubject.next(this.documents);
  }
  // ? CATALOGO
  public catalogs: any[] = [];
  private catalogsSubject = new BehaviorSubject<any[]>([]);

  public subscribeCatalogs(): Observable<any[]> {
    return this.catalogsSubject.asObservable();
  }

  public updateCatalogs(_source: any) {
    this.catalogs = _source.items;

    this.catalogsSubject.next(this.catalogs);
  }

  // ? SEQUENCES
  public sequences: any[] = [];
  private sequencesSubject = new BehaviorSubject<any[]>([]);

  public subscribeSequences(): Observable<any[]> {
    return this.sequencesSubject.asObservable();
  }

  public updateSequences(_source: any) {
    this.sequences = _source.items;

    this.sequencesSubject.next(this.sequences);
  }
  // ? SEQUENCES CHILDS
  public sequencesChilds: any[] = [];
  private sequencesSubjectChilds = new BehaviorSubject<any[]>([]);

  public subscribeSequencesChilds(): Observable<any[]> {
    return this.sequencesSubjectChilds.asObservable();
  }

  public updateSequencesChilds(_source: any) {
    this.sequencesChilds = _source.items;

    this.sequencesSubjectChilds.next(this.sequencesChilds);
  }

  // ? SEQUENCES
  public series: any[] = [];
  private seriesSubject = new BehaviorSubject<any[]>([]);

  public subscribeSeries(): Observable<any[]> {
    return this.seriesSubject.asObservable();
  }

  public updateSeries(_source: any) {
    this.series = _source.items;

    this.seriesSubject.next(this.series);
  }

  // ? SEQUENCES
  public startContribuyente: any[] = [];
  private startContribuyenteSubject = new BehaviorSubject<any[]>([]);

  public subscribeStartContribuyente(): Observable<any[]> {
    return this.startContribuyenteSubject.asObservable();
  }

  public updateStartContribuyente(_source: any) {
    this.startContribuyente = _source.items;

    this.startContribuyenteSubject.next(this.startContribuyente);
  }
  // ? audit history

  public auditHistory: any[] = [];
  private auditHistorySubject = new BehaviorSubject<any[]>([]);

  public subscribeAuditHistory(): Observable<any[]> {
    return this.auditHistorySubject.asObservable();
  }

  public updateAuditHistory(_source: any) {
    this.auditHistory = _source.items;

    this.auditHistorySubject.next(this.auditHistory);
  }
  // ? BPARTNER
  public bparnerts: any[] = [];
  private bparnertsSubject = new BehaviorSubject<any[]>([]);

  public subscribeBpartners(): Observable<any[]> {
    return this.bparnertsSubject.asObservable();
  }

  public updateBpartners(_source: any) {
    this.bparnerts = _source.items;

    this.bparnertsSubject.next(this.bparnerts);
  }
  // ? ORGS
  public orgs: any[] = [];
  private orgsSubject = new BehaviorSubject<any[]>([]);

  public subscribeOrgs(): Observable<any[]> {
    return this.orgsSubject.asObservable();
  }

  public updateOrgs(_source: any) {
    this.bparnerts = _source.items;

    this.orgsSubject.next(this.bparnerts);
  }
  // ? USER
  public users: any[] = [];
  private usersSubject = new BehaviorSubject<any[]>([]);

  public subscribeUsers(): Observable<any[]> {
    return this.usersSubject.asObservable();
  }

  public updateUsers(_source: any) {
    this.users = _source.items;

    this.usersSubject.next(this.users);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  getBySn(sn: string): Observable<any> {
    var url = environment.apiHost + "certificates/" + sn;
    return this.http.get(url);
  }

  getParent(sn: string): Observable<any> {
    var url = environment.apiHost + "certificates/getParentCertificate?sn=" + sn;
    return this.http.get(url);
  }

  getAll(): Observable<any[]> {
    var url = environment.apiHost + "certificates/get-all";
    return this.http.get<any[]>(url);
  }

  getByUser(username: String): Observable<any[]> {
    var url = environment.apiHost + "certificates/getAllForUser?username=" + username;
    return this.http.get<any[]>(url);
  }

  getIssuers(): Observable<any[]> {
    var url = environment.apiHost + "certificates/getAvailableIssuers";
    return this.http.get<any[]>(url);
  }

  issueRoot(username: String): Observable<any> {
    var url = environment.apiHost + "certificates/issue-root-certificate";
    return this.http.post(url, username);
  }

  issueIntermediate(subjectUsername: String, issuerUsername: String, issuerSerialNumber: String): Observable<any> {
    var url = environment.apiHost + "certificates/issue-intermediate-certificate";
    return this.http.post(url, {subjectUsername: subjectUsername, issuerUsername: issuerUsername, issuerSerialNumber: issuerSerialNumber});
  }

  issueEndEntity(subjectUsername: String, issuerUsername: String, issuerSerialNumber: String): Observable<any> {
    var url = environment.apiHost + "certificates/issue-endentity-certificate";
    return this.http.post(url, {subjectUsername: subjectUsername, issuerUsername: issuerUsername, issuerSerialNumber: issuerSerialNumber});
  }

  checkRevocation(sn: string): Observable<any> {
    var url = environment.apiHost + "certificates/is-revoked/" + sn;
    return this.http.get<any>(url);
  }

  revoke(sn: string): Observable<any> {
    var url = environment.apiHost + "certificates/revoke/" + sn;
    return this.http.put<any>(url, {});
  }

  getIssued(username: string) {
    var url = environment.apiHost + "certificates/getAllIssuedByUser?username=" + username;
    return this.http.get<any[]>(url);
  }
}

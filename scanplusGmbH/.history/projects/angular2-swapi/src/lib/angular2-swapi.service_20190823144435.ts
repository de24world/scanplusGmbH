import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Film } from './angular2-swapi.models';

@Injectable({
  providedIn: 'root'
})
export class Angular2SwapiService {

  TAG = 'Angular2 Swapi Service : ';
  swapiUrl = 'https://swapi.co/api/';

  constructor(private _http: HttpClient) { }

  /**
   * Add page value url param
   */
  getByPage(page: number): string {
    if (page) { return '&page=' + page; } else { return ''; }
  }


  /**
   * Return list of films as observable
   */
  getFilms(page?: number): Observable<Film[]> {
    return this._http.get<Film[]>(`${this.swapiUrl}films?format=json${this.getByPage(page)}`)
              .pipe(
                map(resp => resp['results']),
                catchError(this.handleError)
              );
  }

  /**
   * Return film by id
   */
  getFilm(id: number): Observable<Film> {
    return this._http.get<Film>(`${this.swapiUrl}films/${id}?format=json`)
              .pipe(
                catchError(this.handleError)
              );
  }

  /**
   * Search films by title
   */
  searchFilms(title: string): Observable<Film[]> {
    return this._http.get<Film[]>(`${this.swapiUrl}films?search=${title}`)
    .pipe(
      map(resp => resp['results']),
      catchError(this.handleError)
    );
  }


  /**
   * Handle HTTP Errors
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error(`${this.TAG} An error occurred:`, error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `${this.TAG} Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      `${this.TAG} Something bad happened; please try again later.`);
  }

}

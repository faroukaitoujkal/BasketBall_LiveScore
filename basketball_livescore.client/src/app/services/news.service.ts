import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  categories: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // We use rss2json API to fetch ESPN's RSS feed to bypass CORS and parse XML to JSON easily.
  private rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/nba/news';

  constructor(private http: HttpClient) { }

  getTopNews(): Observable<NewsItem[]> {
    return this.http.get<any>(this.rssUrl).pipe(
      map(response => {
        if (response.status === 'ok') {
          return response.items.map((item: any) => ({
            title: item.title,
            description: item.description,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop', // fallback image
            categories: item.categories || ['NBA News']
          }));
        }
        return [];
      })
    );
  }
}

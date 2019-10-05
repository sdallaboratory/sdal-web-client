import { Component, OnInit } from '@angular/core';
import { VkOauthService } from 'src/app/services/vk-oauth.service';

@Component({
  selector: 'sdal-vk-oauth',
  templateUrl: './vk-oauth.component.html',
  styleUrls: ['./vk-oauth.component.scss']
})
export class VkOauthComponent implements OnInit {

  constructor(
    public readonly auth: VkOauthService
  ) { }

  ngOnInit() {
  }

}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuditBodies, AuditTrail } from '../../models/AuditTrail';

@Component({
  selector: 'app-audit-trail-view',
  templateUrl: './audit-trail-view.component.html',
  styleUrls: ['./audit-trail-view.component.scss']
})
export class AuditTrailViewComponent implements OnInit {

  auditBodies: AuditTrail[] = [];
  auditBodiesHeaders: string[] = [];
  auditBodiesValues: string[] = [];
  auditTrail:AuditTrail[] = [];

  constructor(
    public dialogRef: MatDialogRef<AuditTrailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public auditbodies: any,
  ) {
    this.auditbodies=this.auditbodies.auditBodies;
   }

  ngOnInit(): void {
    this.getAuditBodies()
  }
  getAuditBodies() {
    console.log('Audit Bodies onInit', this.auditbodies.length);
    console.log('Audit Bodies data', this.auditbodies);
    if (this.auditbodies.length != 0) {
      console.log('Audit Bodies not empty')
      this.auditBodiesHeaders = Object.keys(this.auditbodies[0]);
    } else {
      this.auditBodiesHeaders = Object.keys(new AuditBodies(null, '','','','',''));
    }
  }

}

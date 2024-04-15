import { Injectable } from '@angular/core';
import { DecisionTreeList } from '../models/DecisionTrees';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class DecisionTreesService {

  API_URL: string = '';
  constructor(
    private http: HttpClient,
    public configurationService: ConfigurationService,
  ) { 
    this.API_URL = this.configurationService.apiUrl().services.alert_configuration_data_service;
  }

//LIST DECISIONTREE
  getListOfTree(){
    return this.http.get<DecisionTreeList[]>(`${this.API_URL}decisiontree/`)
  }

  //CREATE DECISIONTREE WITH INITIAL START NODE AND CLUSTER
  createDecisionTree(decisionTree: DecisionTreeList){
    return this.http.post<DecisionTreeList>(`${this.API_URL}treecreate/`, decisionTree)
  }
  
  //GET DECISION TREE BY ITS ID
  getDecisionTreeById(id: number){
    return this.http.get<DecisionTreeList>(`${this.API_URL}treedetail/${id}/`)
  }  

  //CREATE NODE AND CLUSTER
  createNodeCluster(id: number,treeData:any){
    return this.http.put(`${this.API_URL}treedetail/${id}/`,treeData)
  }

 //DELETE DECISION TREE BY ITS ID
 deleteDecisionTree(id: number){
  return this.http.delete(`${this.API_URL}treedetail/${id}/`)
}
//DELETE DECISION TREE NODE BY ITS ID
deleteTreeNode(id: number,data:any){
  return this.http.put(`${this.API_URL}treeNodeDelete/${id}/`,data)
}

//TO CREATE NODE INDIVIDUALLY
createNode(data: any){
  return this.http.post(`${this.API_URL}newnode/`,data)
}

//GET NODE DATA BY ITS ID
getNodeDataByID(id: number){
  return this.http.get(`${this.API_URL}treenodedetail/${id}/`)
}
//UPDATE NODE DATA BY ITS ID
updateNodeDataByID(id: number,data:any){
  return this.http.put(`${this.API_URL}treenodedetail/${id}/`,data)
}
//GET CLUSTER DATA BY ITS ID
getClusterDataByID(id: number){
  return this.http.get(`${this.API_URL}treeclusterdetail/${id}/`)
}
//UPDATE CLUSTER DATA BY ITS ID
updateClusterDataByID(id: number,data:any){
  return this.http.put(`${this.API_URL}treeclusterdetail/${id}/`,data)
}
//RESET NODE CLUSTER DATA BY ITS ID
resetTree(id: number,data:any){
  return this.http.put(`${this.API_URL}updatetree/${id}/`,data)
}
//UPDATE Tree Optimised Config BY ITS ID
updateOptimalTreeByID(id: number,data:any){
  return this.http.put(`${this.API_URL}treeoptimalupdate/${id}/`,data)
}
//Save Tree name and description
saveTree(id: number,data:any){
  return this.http.put(`${this.API_URL}updatetree/${id}/`,data)
}
}

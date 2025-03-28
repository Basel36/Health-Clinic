export interface IMedicineDetails {
      id: string;
      name: string;
      cost:string;
      photo:string;
}

export interface IMedicine {
      id: string;
      stock: string;
      medicine: IMedicineDetails;
}
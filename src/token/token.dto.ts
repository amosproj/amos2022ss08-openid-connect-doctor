export class TokenDto {
  issuer: string;
  token: string;
  getKeysFromProvider: boolean;
  keyMaterialAlgorithm: string;
  keyMaterialFilepath: string;
}

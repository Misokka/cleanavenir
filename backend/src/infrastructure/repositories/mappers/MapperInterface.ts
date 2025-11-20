export interface Mapper<Raw, Concrete>{
  toDomain(raw: Raw): Concrete;
  toPersistence(obj: Concrete): unknown
}
export interface Mapper<Raw, Concrete, ObjectToPersit>{
  toDomain(raw: Raw): Concrete;
  toPersistence(obj: Concrete): ObjectToPersit
}
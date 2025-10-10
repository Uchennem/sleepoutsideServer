import type { QueryParams, Product } from '../models/types.mts';

export function formatFields(fields:string|string[]) {
    if (typeof fields === 'string') fields = [fields];
    return fields.reduce((acc, field) => ({...acc, [field] : 1}), {});
}

export function buildPaginationWrapper(totalCount:number, query:QueryParams, results:Product[]|null) {
    // here we check to see if there is a limit...if yes convert it to a number, if no set it to the default of 20
    const limit= query.limit? parseInt(query.limit) : 20;
    const offset= query.offset? parseInt(query.offset) : 0;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.ceil(offset / limit)+1;
    const hasPreviousPage = currentPage > 1;
    console.log(currentPage, totalPages);
    const hasNextPage = currentPage < totalPages;
    let next, prev;
    // create a new URLSearchParams object from the query parameters. This will make it easy to modify the fields we need to, while passing all the others on.
    // This is a bit of a hack because we can't use the query object directly in our URLSearchParams constructor.
    const params = new URLSearchParams(query as Record<string, any>);
    if (hasPreviousPage) {
        params.set("offset", (offset - limit).toString());
        prev = `/?${params}`;
    }
    if (hasNextPage) {
        params.set("offset", (offset + limit).toString());
        next = `/?${params}`;
    }
        
    return {
        count: totalCount,
        prev: prev || null,
        next: next || null,
        results: results
    }
}

export function sanitize(v:Record<string, any>) {
  if (typeof v === "object") {
        for (var key in v) {
            console.log(key,/^\$/.test(key) )
            if (/^\$/.test(key) ) {
                delete v[key];
            } else {
                sanitize(v[key]);
            }
        }
    }
    return v;
};
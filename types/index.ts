// =========== CUSTOMER ===========
export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface CustomerWithTickets extends Customer {
    service_tickets: ServiceTicketBasic[];
}

// =========== MECHANIC ===========
export interface Mechanic {
    id: number;
    name: string;
    email: string;
    phone: string;
    salary: number;
}

export interface MechanicWithTickets extends Mechanic {
    service_tickets: ServiceTicketBasic[];
}

// =========== SERVICE TICKET ===========
export interface ServiceTicketBasic {
    id: number;
    VIN: string;
    service_date: string;
    service_desc: string;
}

export interface ServiceTicket extends ServiceTicketBasic {
    customer_id: number;
    customer: Customer;
    mechanics: Mechanic[];
    service_inventories: ServiceInventory[];
}

// =========== INVENTORY ===========
export interface InventoryPart {
    id: number;
    part_name: string;
    price: number;
    quantity_in_stock: number;
}

export interface ServiceInventory {
    id: number;
    service_ticket_id: number;
    inventory_id: number;
    quantity_used: number;
    inventory: InventoryPart;
}

// =========== AUTH ===========
export type UserRole = 'customer' | 'mechanic';

export interface AuthUser {
    uid: string;
    email: string | null;
    role: UserRole;
    db_id: number;
}

// =========== API RESPONSES ===========
export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    per_page: number;
    total: number;
}

export interface APIError {
    message: string;
    error?: string;
}
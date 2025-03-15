// ====================================================
// More Templates: https://www.ebenmonney.com/templates
// Email: support@ebenmonney.com
// ====================================================

export type PermissionNames =
    | "View Users"
    | "Manage Users"
    | "View Roles"
    | "Manage Roles"
    | "Assign Roles"
    | "Change Bill Date"
    | "Delete Bill"
    | "Manage Vat Settings"
    | "Can Discount"
    | "Can Discount Without Limit";

export type PermissionValues =
    | "users.view"
    | "users.manage"
    | "roles.view"
    | "roles.manage"
    | "roles.assign"
    | "changeBillDate"
    | "deleteBill"
    | "manageVat"
    | "canDiscount"
    | "canDiscountWithoutLimit";

export class Permission {
    public static readonly viewUsersPermission: PermissionValues = "users.view";
    public static readonly manageUsersPermission: PermissionValues =
        "users.manage";

    public static readonly viewRolesPermission: PermissionValues = "roles.view";
    //public static readonly viewUpdatesPermission: PermissionValues = "updates.view";

    public static readonly manageRolesPermission: PermissionValues =
        "roles.manage";
    public static readonly assignRolesPermission: PermissionValues =
        "roles.assign";

    //public static readonly manageBillTypePermission: PermissionValues =
    //    "billType.manage";
    //public static readonly manageItemCatPermission: PermissionValues =
    //    "itemCat.manage";

    //public static readonly manageUpdatesPermission: PermissionValues =
    //    "updates.view";


    public static readonly manageChangeBillDatePermission: PermissionValues =
        "changeBillDate";

    public static readonly deleteBillPermission: PermissionValues =
        "deleteBill";

    public static readonly manageVatPermission: PermissionValues =
        "manageVat";

    public static readonly canDiscountPermission: PermissionValues =
        "canDiscount";

    public static readonly canDiscountWithoutLimitPermission: PermissionValues =
        "canDiscountWithoutLimit";

    //public static readonly manageOfferPermission: PermissionValues =
    //    "offer.manage";

    constructor(
        name?: PermissionNames,
        value?: PermissionValues,
        groupName?: string,
        description?: string
    ) {
        this.name = name;
        this.value = value;
        this.groupName = groupName;
        this.description = description;
    }

    public name: PermissionNames;
    public value: PermissionValues;
    public groupName: string;
    public description: string;
}

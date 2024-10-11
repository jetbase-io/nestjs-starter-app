import { Role } from 'src/common/enums/role.enum';

export class UserModel {
  constructor(
    private readonly _userId: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _email: string,
    private readonly _customerStripeId: string | null,
    private readonly _subscriptionId: string | null,
    private readonly _roles: Role,
    private readonly _confirmationToken: string | null,
    private readonly _confirmedAt: Date | null,
    private _username: string,
    private _avatar: string | null,
    private _password: string,
  ) {}

  public get userId(): string {
    return this._userId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get customerStripeId(): string | null {
    return this._customerStripeId;
  }

  public get subscriptionId(): string | null {
    return this._subscriptionId;
  }

  public get roles(): Role {
    return this._roles;
  }

  public get avatar(): string | null {
    return this._avatar;
  }

  public get confirmationToken(): string | null {
    return this._confirmationToken;
  }

  public get confirmedAt(): Date | null {
    return this._confirmedAt;
  }

  public get password(): string {
    return this._password;
  }

  public changeName(name: string): void {
    this._username = name;
  }

  public changeAvatar(url: string): void {
    this._avatar = url;
  }
}

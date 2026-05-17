# Workflow: Upsert Asset Form

## Trigger

/asset-form

## Goal

Tạo hoặc cập nhật form Upsert Asset hoàn chỉnh, bao gồm UI, validation, và API call.

- Nếu truyền `assetId` → chế độ **Edit** (prefill data)
- Nếu không có `assetId` → chế độ **Create**

---

## Context

- UI primitives: `components/ui/` (Gluestack — box, button, input, form-control, toast)
- Styling: NativeWind `className`, không dùng `StyleSheet.create`
- API: `lib/httpClient.ts`
- Types: `types/asset.ts` và `types/asset-item.ts`
- Form component: `components/asset/AssetForm.tsx`
- Screen gọi form: `app/private/asset/` hoặc `app/private/asset-item.tsx`

---

## Steps

### Step 1 — Kiểm tra types

Mở `types/asset.ts` và `types/asset-item.ts`.

- Xác nhận các field bắt buộc (required) và optional
Asse
### Step 2 — Cập nhật httpClient

Mở `services/asset.ts`, thêm 2 function nếu chưa có:

- create: post /assets
- update: put /assets/:id
- get by id: get /assets/:id

### Step 3 — Viết AssetForm component

File: `components/asset/AssetForm.tsx`

Yêu cầu:

- Props: `assetId?: string` — nếu có thì fetch data và prefill
- Dùng react-hook-form: `useForm`, `Controller`
- Dùng Gluestack: `FormControl`, `Input`, `Button`, `Toast` để hiển thị lỗi/thành công
- Validation inline trước khi submit (required fields không được rỗng)
- Submit gọi assetService từ `services/asset.ts` tùy theo có `assetId` hay không và dùng useMutation từ react-query
- Loading state trên Button khi đang submit (`isDisabled`, `ActivityIndicator`)
- Sau submit thành công: hiển thị toast, navigate back
- Tạo assetSchema và AssetValues bằng zod, schema tham khảo (từ Backend Nestjs):

```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type AssetDocument = Asset & Document;

export enum AssetType {
  Device = 'Device',
  Appliance = 'Appliance',
  Furniture = 'Furniture',
  IT = 'IT',
  Facility = 'Facility',
}

@Schema({ timestamps: true })
export class Asset {
  @Prop({ required: true, unique: true })
  code: string; // CAM-HIK-2143

  @Prop({ required: true })
  name: string; // Hikvision DS-2CD2143

  @Prop({ required: true, enum: AssetType })
  type: AssetType;

  @Prop()
  vendor?: string;

  @Prop()
  model?: string;

  @Prop()
  purchaseUrl?: string;

  @Prop({ type: [String], default: [] })
  imageUrls: string[];

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
  updatedBy?: Types.ObjectId;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type ItemDocument = Item & Document;

export enum ItemStatus {
  Active = 'Active',
  Faulty = 'Faulty',
  Maintenance = 'Maintenance',
  Retired = 'Retired',
}

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  assetId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ enum: ItemStatus, default: ItemStatus.Active })
  status: ItemStatus;

  @Prop()
  locationId?: string;

  @Prop()
  owerId?: string;

  @Prop()
  serialNumber?: string;

  @Prop()
  note?: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
  updatedBy?: Types.ObjectId;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
```
Skeleton:

```tsx
type AssetFormProps = { assetId?: string }

export default function AssetForm({ assetId }: AssetFormProps) {
  const isEdit = !!assetId
  // state, fetch, handlers...
  return (
    <VStack className="p-4 gap-4">
      <FormControl isRequired isInvalid={!!errors.name}>
        <Input>
          <InputField placeholder="Asset name" value={form.name} onChangeText={...} />
        </Input>
        <FormControlError><FormControlErrorText>{errors.name}</FormControlErrorText></FormControlError>
      </FormControl>
      {/* các field khác */}
      <Button onPress={handleSubmit} isDisabled={loading}>
        <ButtonText>{isEdit ? 'Update' : 'Create'}</ButtonText>
      </Button>
    </VStack>
  )
}
```

### Step 4 — Tích hợp vào screen

- Nếu **Create**: dùng trong `app/private/asset/index.tsx` hoặc một screen mới `app/private/asset/create.tsx`
- Nếu **Edit**: dùng trong `app/private/asset-item.tsx`, truyền `assetId` từ route params:
  ```ts
  const { id } = useLocalSearchParams()
  <AssetForm assetId={id as string} />
  ```

### Step 5 — Kiểm tra convention

- Không có `StyleSheet.create` nào trong file mới
- Không hardcode màu, dùng `constants/theme.ts` nếu cần
- Types mới đã export từ `types/index.ts`

---

## Output checklist

- [x] `types/asset.ts` có `CreateAssetPayload` và `UpdateAssetPayload`
- [x] `lib/httpClient.ts` có `createAsset`, `updateAsset`, `getAssetById`
- [x] `components/asset/AssetForm.tsx` hoạt động ở cả 2 chế độ Create / Edit
- [x] Screen tương ứng đã import và dùng `AssetForm`
- [x] Loading state và error handling đã có
- [x] Toast thông báo thành công / thất bại

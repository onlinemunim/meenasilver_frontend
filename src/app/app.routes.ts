
import { RawMetalListComponent } from './Component/Auth/raw-metal/raw-metal-list/raw-metal-list.component';
import { ImitationStockB2Component } from './Component/Auth/stock/retail-imitation-stock/imitation-stock-b2/imitation-stock-b2.component';
import { SinglevoucherComponent } from './Component/Voucher/singlevoucher/singlevoucher.component';
import { Routes, CanActivateFn } from '@angular/router';
import { LoginComponent } from './Component/Unauth/login/login.component';
import { SignupComponent } from './Component/Unauth/signup/signup.component';
import { HomeComponent } from './Component/home/home.component';
import { authGuardGuard } from './auth-guard.guard';
import { UserListComponent } from './Component/User/user-list/user-list.component';
import { UserEditComponent } from './Component/User/user-edit/user-edit.component';
import { UserCreateComponent } from './Component/User/user-create/user-create.component';
import { PackageShowComponent } from './Component/Package/package-show/package-show.component';
import { PackageCreateComponent } from './Component/Package/package-create/package-create.component';
import { PackageEditComponent } from './Component/Package/package-edit/package-edit.component';
import { SinglepackageShowComponent } from './Component/Package/singlepackage-show/singlepackage-show.component';
import { SingleUserComponent } from './Component/User/single-user/single-user.component';
import { CountryShowComponent } from './Component/Core/Country/country-show/country-show.component';
import { CountryEditComponent } from './Component/Core/Country/country-edit/country-edit.component';
import { CountryCreateComponent } from './Component/Core/Country/country-create/country-create.component';
import { StatesShowComponent } from './Component/Core/States/states-show/states-show.component';
import { StatesEditComponent } from './Component/Core/States/states-edit/states-edit.component';
import { StatesCreateComponent } from './Component/Core/States/states-create/states-create.component';
import { CitiesShowComponent } from './Component/Core/Cities/cities-show/cities-show.component';
import { CitiesEditComponent } from './Component/Core/Cities/cities-edit/cities-edit.component';
import { CitiesCreateComponent } from './Component/Core/Cities/cities-create/cities-create.component';
import { OwnerShowComponent } from './Component/Owner/owner-show/owner-show.component';
import { OwnerCreateComponent } from './Component/Owner/owner-create/owner-create.component';
import { OwnerEditComponent } from './Component/Owner/owner-edit/owner-edit.component';
import { OwnerSingleComponent } from './Component/Owner/owner-single/owner-single.component';
import { ForgotPasswordComponent } from './Component/Unauth/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './Component/Unauth/verify-otp/verify-otp.component';
import { UpdatePasswordComponent } from './Component/Unauth/update-password/update-password.component';
import { ValidateOtpComponent } from './Component/Unauth/validate-otp/validate-otp.component';
import { UnauthenticatedLayoutComponent } from './Component/Unauth/unauthenticated-layout/unauthenticated-layout.component';
import { FirmListComponent } from './Component/Firm/firm-list/firm-list.component';
import { EditvoucherComponent } from './Component/Voucher/editvoucher/editvoucher.component';
import { VoucherlistComponent } from './Component/Voucher/voucherlist/voucherlist.component';
import { CreatevoucherComponent } from './Component/Voucher/createvoucher/createvoucher.component';
import { FirmCreateComponent } from './Component/Firm/firm-create/firm-create.component';
import { AddStockComponent } from './Component/Auth/stock/add-stock/add-stock.component';
import { SellComponent } from './Component/Auth/sell/sell.component';

import { CreateUserComponent } from './Component/Auth/user/create-user/create-user.component';
import { AddCustomerComponent } from './Component/Auth/user/add-customer/add-customer.component';
import { AddStaffComponent } from './Component/Auth/user/add-staff/add-staff.component';
import { AddSupplierComponent } from './Component/Auth/user/add-supplier/add-supplier.component';
import { AddInvestorComponent } from './Component/Auth/user/add-investor/add-investor.component';
import { AlluserListComponent } from './Component/Auth/user/alluser-list/alluser-list.component';
import { CustomerListComponent } from './Component/Auth/user/customer-list/customer-list.component';
import { StaffListComponent } from './Component/Auth/user/staff-list/staff-list.component';
import { SupplierListComponent } from './Component/Auth/user/supplier-list/supplier-list.component';
import { InvestorListComponent } from './Component/Auth/user/investor-list/investor-list.component';

import { FirmEditComponent } from './Component/Firm/firm-edit/firm-edit.component';
import { TestFileUploadComponent } from './Component/test-file-upload/test-file-upload.component';
import { StockFeatureComponent } from './Component/Auth/stock/stock-feature/stock-feature.component';

import { AddReadyProductComponent } from './Component/Auth/stock/add-ready-product/add-ready-product.component';
import { GeneralListComponent } from './Component/Auth/stock/general-list/general-list.component';
import { RateListGeneratorComponent } from './Component/Auth/rate-list/rate-list-generator/rate-list-generator.component';
import { GeneratedRatelistComponent } from './Component/Auth/rate-list/generated-ratelist/generated-ratelist.component';
import { RawMetalEntryComponent } from './Component/Auth/raw-metal/raw-metal-entry/raw-metal-entry.component';
import { MetalComponent } from './Component/Auth/raw-metal/metal/metal.component';
import { StoneComponent } from './Component/Auth/raw-metal/stone/stone.component';
import { TagListComponent } from './Component/Auth/tag/tag-list/tag-list.component';
import { AssembleProductComponent } from './Component/Auth/tag/assemble-product/assemble-product.component';
import { FineProductComponent } from './Component/Auth/tag/fine-product/fine-product.component';
import { CreateTagComponent } from './Component/Auth/tag/create-tag/create-tag.component';
import { AssembleTaglistComponent } from './Component/Auth/tag/assemble-taglist/assemble-taglist.component';
import { FineTaglistComponent } from './Component/Auth/tag/fine-taglist/fine-taglist.component';
import { ForbiddenComponent } from './Component/Core/error/forbidden/forbidden.component';
import { NotFoundComponent } from './Component/Core/error/not-found/not-found.component';
import { CategoriesListComponent } from './Component/Auth/stock/categories-list/categories-list.component';
import { StaffDashboardComponent } from './Component/Auth/rmportal/staff-dashboard/staff-dashboard.component';
import { TopCustomersComponent } from './Component/Auth/rmportal/home/top-customers/top-customers.component';
import { RecentOrderListComponent } from './Component/Auth/rmportal/home/recent-order-list/recent-order-list.component';
import { SalesTargetComponent } from './Component/Auth/rmportal/home/sales-target/sales-target.component';
import { IncentivesComponent } from './Component/Auth/rmportal/home/incentives/incentives.component';
import { SalesTargetAnalysisComponent } from './Component/Auth/rmportal/home/sales-target-analysis/sales-target-analysis.component';
import { TopDetailsComponent } from './Component/Auth/rmportal/home/top-details/top-details.component';
import { StaffHomeComponent } from './Component/Auth/rmportal/home/staff-home/staff-home.component';
import { StockOverviewComponent } from './Component/Auth/rmportal/home/stock-overview/stock-overview.component';
import { AddFineStockB1Component } from './Component/Auth/stock/retail-fine-stock/add-fine-stock-b1/add-fine-stock-b1.component';
import { AddFineStockB2Component } from './Component/Auth/stock/retail-fine-stock/add-fine-stock-b2/add-fine-stock-b2.component';
import { AddFineStockB3Component } from './Component/Auth/stock/retail-fine-stock/add-fine-stock-b3/add-fine-stock-b3.component';

import { AddCadStockComponent } from './Component/Auth/stock/retail-fine-stock/add-cad-stock/add-cad-stock.component';
import { AddMetalFormB2Component } from './Component/Auth/stock/retail-fine-stock/add-metal-form-b2/add-metal-form-b2.component';
import { ProductCreationComponent } from './Component/Auth/stock/product-creation/product-creation.component';
import { ReadyProductListComponent } from './Component/Auth/stock/ready-product-list/ready-product-list.component';
import { SharedProductService } from './Services/Product_Creation/shared-product.service';
import { ProductEditComponent } from './Component/Auth/stock/product-edit/product-edit.component';
import { CustomizeFormComponent } from './customize-form/customize-form.component';
import { RawStoneListComponent } from './Component/Auth/raw-metal/raw-stone-list/raw-stone-list.component';
import { CreateReportComponent } from './Component/Auth/report/create-report/create-report.component';
import { FineJewelleryComponent } from './Component/Auth/report/fine-jewellery/fine-jewellery.component';
import { RawMetalComponent } from './Component/Auth/report/raw-metal/raw-metal.component';
import { RawMetalStockComponent } from './Component/Auth/report/raw-metal-stock/raw-metal-stock.component';
import { StoneStockComponent } from './Component/Auth/report/stone-stock/stone-stock.component';
import { StockTallyComponent } from './Component/Auth/report/stock-tally/stock-tally.component';
import { ReorderListComponent } from './Component/Auth/report/reorder-list/reorder-list.component';
import { OtherPanelComponent } from './Component/Auth/report/other-panel/other-panel.component';
import { AddWholesaleStockB1Component } from './Component/Auth/stock/wholsale-fine-stock/add-wholesale-stock-b1/add-wholesale-stock-b1.component';
import { AddWholesaleStockB2Component } from './Component/Auth/stock/wholsale-fine-stock/add-wholesale-stock-b2/add-wholesale-stock-b2.component';
import { AddWholesaleStockB3Component } from './Component/Auth/stock/wholsale-fine-stock/add-wholesale-stock-b3/add-wholesale-stock-b3.component';


import { ImitationStockB1Component } from './Component/Auth/stock/retail-imitation-stock/imitation-stock-b1/imitation-stock-b1.component';
import { ImitationStockB3Component } from './Component/Auth/stock/retail-imitation-stock/imitation-stock-b3/imitation-stock-b3.component';
import { ImitationFashionJewelleryComponent } from './Component/Auth/stock/retail-imitation-stock/imitation-fashion-jewellery/imitation-fashion-jewellery.component';
import { ImitationJewelleryComponent } from './Component/Auth/report/imitation-jewellery/imitation-jewellery.component';
import { AddSterlingJewelleryStockComponent } from './Component/Auth/stock/retail-imitation-stock/add-sterling-jewellery-stock/add-sterling-jewellery-stock.component';

import { WholsaleImitationStockB1Component } from './Component/Auth/stock/wholsale-imitation-stock/wholsale-imitation-stock-b1/wholsale-imitation-stock-b1.component';
import { WholsaleImitationStockB2Component } from './Component/Auth/stock/wholsale-imitation-stock/wholsale-imitation-stock-b2/wholsale-imitation-stock-b2.component';
import { WholsaleImitationStockB3Component } from './Component/Auth/stock/wholsale-imitation-stock/wholsale-imitation-stock-b3/wholsale-imitation-stock-b3.component';
import { WholsaleImitationFashionJewelleryComponent } from './Component/Auth/stock/wholsale-imitation-stock/wholsale-imitation-fashion-jewellery/wholsale-imitation-fashion-jewellery.component';
import { WholsaleImitationAddSterlingJewelleryStockComponent } from './Component/Auth/stock/wholsale-imitation-stock/wholsale-imitation-add-sterling-jewellery-stock/wholsale-imitation-add-sterling-jewellery-stock.component';

import { AddFineStockB1ScrollComponent } from './Component/Auth/stock/retail-fine-stock/add-fine-stock-b1-scroll/add-fine-stock-b1-scroll.component';
import { AvailableRetailStockListComponent } from './Component/Auth/stock/available-retail-stock-list/available-retail-stock-list.component';
import { DropdownSettingComponent } from './Component/Customize-Dropdown/dropdown-setting/dropdown-setting.component';
import { StockInListComponent } from './Component/Auth/stock/stock-in-list/stock-in-list.component';
import { StockOutListComponent } from './Component/Auth/stock/stock-out-list/stock-out-list.component';
import { PackagingFormComponent } from './Component/Auth/stock/packaging-form/packaging-form.component';
import { PackagingListComponent } from './Component/Auth/report/packaging-list/packaging-list.component';
import { AssigneComponent } from './Component/Auth/stock/assigne/assigne.component';
import { OrderCreationComponent } from './Component/Auth/stock/order-creation/order-creation.component';
import { DesignProductComponent } from './Component/Auth/stock/design-product/design-product.component';
import { SupplierPersonalComponent } from './Component/Auth/user/supplier-personal/supplier-personal.component';
import { OrdersCreationComponent } from './Component/Auth/stock/orders-creation/orders-creation.component';
import { KalakaarManagementComponent } from './Component/Auth/kalakaar/kalakaar-management/kalakaar-management.component';
import { AccountComponent } from './Component/Auth/kalakaar/account/account.component';
import { OrderComponent } from './Component/Auth/kalakaar/order/order.component';
import { RawMaterialComponent } from './Component/Auth/kalakaar/raw-material/raw-material.component';
import { KalakaarHomeComponent } from './Component/Auth/kalakaar/kalakaar-home/kalakaar-home.component';
import { InvestorPersonalComponent } from './Component/Auth/user/investor-personal/investor-personal.component';
import { AvailableToProduceComponent } from './Component/Auth/available-to-produce/available-to-produce.component';
import { MaterialRequirementSheetComponent } from './Component/Auth/material-requirement-sheet/material-requirement-sheet.component';
import { ComboCreationComponent } from './Component/Auth/combo-creation/combo-creation.component';
import { StaffPersonalComponent } from './Component/Auth/user/staff-personal/staff-personal.component';
import { ProductTaggingComponent } from './Component/Auth/tag/product-tagging/product-tagging.component';
import { ReadyProductLotComponent } from './Component/Auth/stock/ready-product-lot/ready-product-lot.component';
import { ReadyProductPieceComponent } from './Component/Auth/stock/ready-product-piece/ready-product-piece.component';
import { AdminPanelComponent } from './Component/Auth/Admin/admin-panel/admin-panel.component';
import { ProductTaggingListComponent } from './Component/Auth/tag/product-tagging-list/product-tagging-list.component';
import { PackagingStackFormComponent } from './Component/Auth/stock/packaging-stack-form/packaging-stack-form.component';
import { TagLabelsComponent } from './Component/Auth/tag/tag-labels/tag-labels.component';
import { GoldSilverStockListComponent } from './Component/Auth/list/gold-silver-stock-list/gold-silver-stock-list.component';
import { StockListComponent } from './Component/Auth/stock/stock-list/stock-list.component';
import { GoldStockListComponent } from './Component/Auth/list/gold-stock-list/gold-stock-list.component';
import { SilverStockListComponent } from './Component/Auth/list/silver-stock/silver-stock-list.component';
import { JewelleryPanelListComponent } from './Component/Auth/list/jewellery-panel-list/jewellery-panel-list.component';
import { PurchaseStockCategoryListListComponent } from './Component/Auth/list/purchase-stock-category-list-list/purchase-stock-category-list-list.component';
import { PurchaseStockListListComponent } from './Component/Auth/list/purchase-stock-list-list/purchase-stock-list-list.component';
import { WholesaleSearchListComponent } from './Component/Auth/list/wholesale-search-list/wholesale-search-list.component';
import { SoldOutStockListComponent } from './Component/Auth/list/sold-out-stock-list/sold-out-stock-list.component';
import { SoldOutStockList2ListComponent } from './Component/Auth/list/sold-out-stock-list2-list/sold-out-stock-list2-list.component';
import { RetailStockListListComponent } from './Component/Auth/list/retail-stock-list-list/retail-stock-list-list.component';
import { ImmitationRetailStockListComponent } from './Component/Auth/list/immitation-retail-stock-list/immitation-retail-stock-list.component';
import { ImmitationTotalAvailableStockListComponent } from './Component/Auth/list/immitation-total-available-stock-list/immitation-total-available-stock-list.component';
import { ImmitationPurchaseListComponent } from './Component/Auth/list/immitation-purchase-list/immitation-purchase-list.component';
import { ImmitationSterlingJewelleryPanelImageComponent } from './Component/Auth/list/immitation-sterling-jewellery-panel-image/immitation-sterling-jewellery-panel-image.component';
import { ImmitationSterlingJewelleryPanelListComponent } from './Component/Auth/list/immitation-sterling-jewellery-panel-list/immitation-sterling-jewellery-panel-list.component';
import { ImmitationWholesaleSearchImagesComponent } from './Component/Auth/list/immitation-wholesale-search-images/immitation-wholesale-search-images.component';
import { RawStoneStockListComponent } from './Component/Auth/list/raw-stone-stock-list/raw-stone-stock-list.component';
import { Component } from '@angular/core';
import { AllRawMetalStockListComponent } from './Component/Auth/list/all-raw-metal-stock-list/all-raw-metal-stock-list.component';
import { SellDetailsPanelComponent } from './Component/Auth/sells-panel/sell-details-panel/sell-details-panel.component';
import { PaymentDetailsComponent } from './Component/Auth/sells-panel/payment-details/payment-details/payment-details.component';
import { PaymentPanelComponent } from './Component/Auth/sells-panel/payment-details/payment-panel/payment-panel.component';
import { SellCustomerComponent } from './Component/Auth/sell-customer/sell-customer.component'
import { DiamondStoneStockComponent } from './Component/Auth/stock/diamond-stone-stock/diamond-stone-stock.component';
import { CashDetailsComponent } from './Component/Auth/sells-panel/payment-details/cash-details/cash-details.component';
import { InvoicePanelComponent } from './Component/Auth/sells-panel/invoice-panel/invoice-panel.component';
import { InvoiceB2bComponent } from './Component/Auth/sells-panel/invoice-b2b/invoice-b2b.component';
import { InvoiceLayoutComponent } from './Component/Auth/sells-panel/invoice-layout/invoice-layout.component';
import { RateListInvoiceComponent } from './Component/Auth/rate-list/rate-list-invoice/rate-list-invoice.component';
import { FirmEditParentComponent } from './Component/Firm/firm-edit-parent/firm-edit-parent.component';
import { KalakarListComponent } from './Component/Auth/user/kalakar-list/kalakar-list.component';
import { RoughEstimateComponent } from './Component/Auth/sells-panel/rough-estimate/rough-estimate.component';
import { SellDetailsLotComponent } from './Component/Auth/sells-panel/sell-details-lot/sell-details-lot.component';
import { AddCategoryComponent } from './Component/Auth/Category/add-category/add-category.component';
import { AssemblyContainerComponent } from './Component/Auth/Assembly-Container/assembly-container/assembly-container.component';
import { AssemblyBrandComponent } from './Component/Auth/Assembly-Container/assembly-brand/assembly-brand.component';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: '', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'user/create', component: UserCreateComponent, canActivate: [authGuardGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuardGuard] },
  { path: 'user/:id/edit', component: UserEditComponent, canActivate: [authGuardGuard] },
  { path: 'countries', component: CountryShowComponent, canActivate: [authGuardGuard] },
  { path: 'countries/:id/edit', component: CountryEditComponent, canActivate: [authGuardGuard] },
  { path: 'countries/create', component: CountryCreateComponent, canActivate: [authGuardGuard] },
  { path: 'states', component: StatesShowComponent, canActivate: [authGuardGuard] },
  { path: 'states/:id/edit', component: StatesEditComponent, canActivate: [authGuardGuard] },
  { path: 'states/create', component: StatesCreateComponent, canActivate: [authGuardGuard] },
  { path: 'cities', component: CitiesShowComponent, canActivate: [authGuardGuard] },
  { path: 'cities/:id/edit', component: CitiesEditComponent, canActivate: [authGuardGuard] },
  { path: 'cities/create', component: CitiesCreateComponent, canActivate: [authGuardGuard] },

  { path: 'packages', component: PackageShowComponent, canActivate: [authGuardGuard] },
  { path: 'package/create', component: PackageCreateComponent, canActivate: [authGuardGuard] },
  { path: 'package/:id/edit', component: PackageEditComponent, canActivate: [authGuardGuard] },
  { path: 'packages/package/:id/details', component: SinglepackageShowComponent, canActivate: [authGuardGuard] },

  //owner related paths here
  { path: 'owners', component: OwnerShowComponent, canActivate: [authGuardGuard] },
  { path: 'owner/create', component: OwnerCreateComponent, canActivate: [authGuardGuard] },
  { path: 'owner/:id/edit', component: OwnerEditComponent, canActivate: [authGuardGuard] },
  { path: 'owner/:id/singleowner', component: OwnerSingleComponent, canActivate: [authGuardGuard] },

  { path: 'voucher', component: VoucherlistComponent, canActivate: [authGuardGuard] },
  { path: 'voucher/:id/edit', component: EditvoucherComponent, canActivate: [authGuardGuard] },
  { path: 'voucher/create', component: CreatevoucherComponent, canActivate: [authGuardGuard] },
  { path: 'voucher/:id/singlevoucher', component: SinglevoucherComponent, canActivate: [authGuardGuard] },

  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'update-password', component: UpdatePasswordComponent },
  { path: 'validate-otp', component: ValidateOtpComponent },
  { path: 'layout', component: UnauthenticatedLayoutComponent },

  { path: 'firm/:id/edit', component: FirmEditParentComponent, canActivate: [authGuardGuard] },

  { path: 'firm-list', component: FirmListComponent, canActivate: [authGuardGuard] },
  { path: 'firm-create', component: FirmCreateComponent, canActivate: [authGuardGuard] },

  {
    path: 'add-stock', component: AddStockComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'add-retail-fine-stock-b1', component: AddFineStockB1Component, canActivate: [authGuardGuard] },
      { path: 'add-retail-fine-stock-b2', component: AddFineStockB2Component, canActivate: [authGuardGuard] },
      { path: 'add-retail-fine-stock-b3', component: AddFineStockB3Component, canActivate: [authGuardGuard] },

      { path: 'add-cad-stock', component: AddCadStockComponent, canActivate: [authGuardGuard] },
      { path: 'add-metal-form-b2', component: AddMetalFormB2Component, canActivate: [authGuardGuard] },
      { path: 'add-wholesale-fine-stock-b1', component: AddWholesaleStockB1Component, canActivate: [authGuardGuard] },
      { path: 'add-wholesale-fine-stock-b2', component: AddWholesaleStockB2Component, canActivate: [authGuardGuard] },
      { path: 'add-wholesale-fine-stock-b3', component: AddWholesaleStockB3Component, canActivate: [authGuardGuard] },
      { path: 'add-retail-fine-stock-b1-scroll', component: AddFineStockB1ScrollComponent, canActivate: [authGuardGuard] },
      { path: 'add-retail-imitation-stock-b1', component: ImitationStockB1Component, canActivate: [authGuardGuard] },

      { path: 'add-retail-imitation-stock-b2', component: ImitationStockB2Component, canActivate: [authGuardGuard] },
      { path: 'add-retail-imitation-stock-b3', component: ImitationStockB3Component, canActivate: [authGuardGuard] },

      { path: 'add-retail-imitation-fashion-jewellery', component: ImitationFashionJewelleryComponent, canActivate: [authGuardGuard] },

      { path: 'add-retail-add-sterling-jewellery-stock', component: AddSterlingJewelleryStockComponent, canActivate: [authGuardGuard]  },
      { path: '', redirectTo: 'add-retail-fine-stock-b1', pathMatch: 'full' },


      // wholsale-imitation-stock

     {path: 'add-wholsale-imitation-stock-b1',component: WholsaleImitationStockB1Component, canActivate: [authGuardGuard]},
     {path: 'add-wholsale-imitation-stock-b2',component: WholsaleImitationStockB2Component, canActivate: [authGuardGuard]},
     {path: 'add-wholsale-imitation-stock-b3',component: WholsaleImitationStockB3Component, canActivate: [authGuardGuard]},
     {path: 'add-wholsale-imitation-fashion-jewellery',component: WholsaleImitationFashionJewelleryComponent, canActivate: [authGuardGuard]},
     { path: 'add-wholsale-imitation-add-sterling-jewellery', component: WholsaleImitationAddSterlingJewelleryStockComponent, canActivate: [authGuardGuard] },


    //  { path: 'add-raw-metal-stock', component: RawMetalStockComponent, canActivate: [authGuardGuard] },
     { path: 'raw-metal-stock', component: RawMetalStockComponent },
     {path: 'diamond-stone-stock', component: DiamondStoneStockComponent }


    ]
  },
  { path: '', redirectTo: 'add-stock', pathMatch: 'full' },

  {
    path: 'report', component: CreateReportComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'fine-jewellery', component: FineJewelleryComponent, canActivate: [authGuardGuard] },
      { path: 'gold-silver-stock', component: GoldSilverStockListComponent, canActivate: [authGuardGuard] },
      { path: 'gold-stock', component: GoldStockListComponent, canActivate: [authGuardGuard] },
      { path: 'silver-stock', component: SilverStockListComponent, canActivate: [authGuardGuard] },
      { path: 'jewellery-panel-list', component: JewelleryPanelListComponent, canActivate: [authGuardGuard] },
      { path: 'purchase-stock-category-list-list', component: PurchaseStockCategoryListListComponent, canActivate: [authGuardGuard] },
      { path: 'purchase-stock-list-list', component: PurchaseStockListListComponent, canActivate: [authGuardGuard] },
      { path: 'wholesale-search-list', component: WholesaleSearchListComponent, canActivate: [authGuardGuard] },
      { path: 'sold-out-stock-list', component: SoldOutStockListComponent, canActivate: [authGuardGuard] },
      { path: 'sold-out-stock-list2-list', component: SoldOutStockList2ListComponent, canActivate: [authGuardGuard] },
      { path: 'retail-stock-list-list', component: RetailStockListListComponent, canActivate: [authGuardGuard] },
      { path: 'imitation-jewellery', component: ImitationJewelleryComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-retail-stock-list', component: ImmitationRetailStockListComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-total-available-stock-list', component: ImmitationTotalAvailableStockListComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-purchase-list', component: ImmitationPurchaseListComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-sterling-jewellery-panel-image', component: ImmitationSterlingJewelleryPanelImageComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-sterling-jewellery-panel-list', component: ImmitationSterlingJewelleryPanelListComponent, canActivate: [authGuardGuard] },
      { path: 'immitation-wholesale-search-images', component: ImmitationWholesaleSearchImagesComponent, canActivate: [authGuardGuard] },
      { path: 'raw-metal', component: RawMetalComponent, canActivate: [authGuardGuard] },
      { path: 'raw-metal-stock', component: RawMetalListComponent, canActivate: [authGuardGuard] },
      { path: 'raw-stone-stock-list', component: RawStoneListComponent, canActivate: [authGuardGuard]},
      { path: 'all-raw-metal-stock-list', component: AllRawMetalStockListComponent, canActivate: [authGuardGuard]},
      { path: 'stone-stock', component: RawStoneListComponent, canActivate: [authGuardGuard] },
      { path: 'stock-tally', component: StockTallyComponent, canActivate: [authGuardGuard] },

      { path: 'ready-product-list', component: ReadyProductListComponent, canActivate: [authGuardGuard] },
      { path: 'reorder-list', component: ReorderListComponent, canActivate: [authGuardGuard] },
      { path: 'other-panel', component: OtherPanelComponent, canActivate: [authGuardGuard] },
      { path: 'stock-ins', component: StockInListComponent, canActivate: [authGuardGuard] },
      { path: 'stock-outs', component: StockOutListComponent, canActivate: [authGuardGuard] },
      { path: 'stock-list', component: StockListComponent, canActivate: [authGuardGuard] },
      { path: 'stock-packaging-list', component: PackagingListComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'fine-jewellery', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'report', pathMatch: 'full' },

  { path: 'sell', component: SellComponent, canActivate: [authGuardGuard] },
  {path: 'sell-details', component: SellDetailsPanelComponent, canActivate: [authGuardGuard]},
  {path: 'sell-details/:id', component: SellDetailsPanelComponent, canActivate: [authGuardGuard]},
  {path: 'sell-customer', component: SellCustomerComponent, canActivate: [authGuardGuard]},
  {path: 'sell-details/customer/:id/sell-details', component: SellDetailsPanelComponent, canActivate: [authGuardGuard]},
  {path: 'sell-details-lot/:id', component: SellDetailsLotComponent, canActivate: [authGuardGuard]},
  {path: 'payment-details', component: PaymentDetailsComponent, canActivate: [authGuardGuard]},
  {path: 'payment-details/:id', component: PaymentDetailsComponent, canActivate: [authGuardGuard]},
  {path: 'payment-panel', component: PaymentPanelComponent, canActivate: [authGuardGuard]},

  // {path: 'payment-details', component: PaymentDetailsComponent, canActivate: [authGuardGuard],
  //   children: [
  //     {path: 'payment-panel', component: PaymentPanelComponent, canActivate: [authGuardGuard]},
  //     {path: 'cash-details', component: CashDetailsComponent, canActivate: [authGuardGuard]},
  //   ]
  // },

  {
    path: 'invoice-panel',component: InvoicePanelComponent,canActivate: [authGuardGuard]
  },
  { path: 'admin-customize-invoice',component: InvoiceLayoutComponent,canActivate: [authGuardGuard]},
  {
    path: 'invoice-b2b/:id',component: InvoiceB2bComponent, canActivate: [authGuardGuard]
  },
  { path: 'rough-estimate-invoice/:id',component: RoughEstimateComponent,canActivate: [authGuardGuard]},

  {
    path: 'invoice-panel/:id',component: InvoicePanelComponent,canActivate: [authGuardGuard]
  },

  {
    path: 'cash-details',component: CashDetailsComponent,canActivate: [authGuardGuard]
  },
  {
    path: 'payment-details',
    component: PaymentDetailsComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: '',
        redirectTo: 'payment-panel', // ✅ redirect when path is /payment-details
        pathMatch: 'full'
      },
      {
        path: 'payment-panel',
        component: PaymentPanelComponent,
        canActivate: [authGuardGuard]
      },
      {
        path: 'cash-details',
        component: CashDetailsComponent,
        canActivate: [authGuardGuard]
      }
    ]
  },


  {
    path: 'create-user', component: CreateUserComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'add-customer', component: AddCustomerComponent, canActivate: [authGuardGuard] },
      { path: 'add-staff', component: AddStaffComponent, canActivate: [authGuardGuard] },
      { path: 'add-supplier', component: AddSupplierComponent, canActivate: [authGuardGuard] },
      { path: 'add-investor', component: AddInvestorComponent, canActivate: [authGuardGuard] },
      { path: 'customer/:id/edit', component: AddCustomerComponent, canActivate: [authGuardGuard] },
      { path: 'investor/:id/edit', component: AddInvestorComponent, canActivate: [authGuardGuard] },
      { path: 'supplier/:id/edit', component: AddSupplierComponent, canActivate: [authGuardGuard] },
      { path: 'staff/:id/edit', component: AddStaffComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'add-customer', pathMatch: 'full' }

    ]
  },
  { path: '', redirectTo: 'create-user', pathMatch: 'full' },

  {
    path: 'user-list', component: AlluserListComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'customer-list', component: CustomerListComponent, canActivate: [authGuardGuard] },
      { path: 'staff-list', component: StaffListComponent, canActivate: [authGuardGuard] },
      { path: 'supplier-list', component: SupplierListComponent, canActivate: [authGuardGuard] },
      { path: 'investor-list', component: InvestorListComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'customer-list', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },

  { path: 'file-upload', component: TestFileUploadComponent, canActivate: [authGuardGuard] },

  { path: 'stock-feature', component: StockFeatureComponent, canActivate: [authGuardGuard] },
  {
    path: 'add-ready-product', component: AddReadyProductComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'piece', component: ReadyProductPieceComponent, canActivate: [authGuardGuard] },
      { path: 'lot', component: ReadyProductLotComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'piece', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'add-ready-product', pathMatch: 'full' },
  { path: 'add-ready-product', component: AddReadyProductComponent, canActivate: [authGuardGuard] },
  { path: 'rate-list-generator', component: RateListGeneratorComponent, canActivate: [authGuardGuard] },
  { path: 'generated-rate-list', component: GeneratedRatelistComponent, canActivate: [authGuardGuard] },
  { path: 'rate-list-invoice', component: RateListInvoiceComponent, canActivate: [authGuardGuard] },
  {
    path: 'rate-list/print/:id',
    component: RateListInvoiceComponent,
    canActivate: [authGuardGuard],
  },
  { path: 'add-category', component: AddCategoryComponent, canActivate: [authGuardGuard] },
  {
    path: 'raw-metal', component: RawMetalEntryComponent, canActivate: [authGuardGuard],
    children: [

      { path: 'metal', component: MetalComponent, canActivate: [authGuardGuard] },
      { path: 'stone', component: StoneComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'metal', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'raw-metal', pathMatch: 'full' },

  { path: 'general-list', component: GeneralListComponent, canActivate: [authGuardGuard] },

  {
    path: 'create-tag', component: CreateTagComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'assemble-product', component: AssembleProductComponent, canActivate: [authGuardGuard] },
      { path: 'fine-product', component: FineProductComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'assemble-product', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'create-tag', pathMatch: 'full' },

  {
    path: 'tag-list', component: TagListComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'assemble-taglist', component: AssembleTaglistComponent, canActivate: [authGuardGuard] },
      { path: 'fine-taglist', component: FineTaglistComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'assemble-taglist', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'tag-list', pathMatch: 'full' },

  { path: 'error-403', component: ForbiddenComponent, canActivate: [authGuardGuard] },
  { path: 'error-404', component: NotFoundComponent, canActivate: [authGuardGuard] },

  { path: 'categories-list', component: CategoriesListComponent },

  {
    path: 'rm-portal', component: StaffDashboardComponent, canActivate: [authGuardGuard],
    children: [
      {
        path: 'home', component: StaffHomeComponent, canActivate: [authGuardGuard],
        children: [
          { path: 'top-details', component: TopDetailsComponent, canActivate: [authGuardGuard] },
          { path: 'sales-target', component: SalesTargetComponent, canActivate: [authGuardGuard] },
          { path: 'stock-overview', component: StockOverviewComponent, canActivate: [authGuardGuard] },
        ]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: 'customize-form', component: CustomizeFormComponent, canActivate: [authGuardGuard] },

  { path: 'product-creation', component: ProductCreationComponent, canActivate: [authGuardGuard] },
  { path: 'shared/:id/product', component: ProductEditComponent, canActivate: [authGuardGuard] },
  { path: 'ready-product-list', component: ReadyProductListComponent, canActivate: [authGuardGuard] },
  { path: 'edit/:id/ready-product', component: AddReadyProductComponent, canActivate: [authGuardGuard] },
  { path: 'raw-metal-list', component: RawMetalListComponent, canActivate: [authGuardGuard] },
  { path: 'edit/:id/raw-metal', component: MetalComponent, canActivate: [authGuardGuard] },
  { path: 'raw-stone-list', component: RawStoneListComponent, canActivate: [authGuardGuard] },
  { path: 'edit/:id/raw-stone', component: StoneComponent, canActivate: [authGuardGuard] },
  { path: 'available-retail-stock-list', component: AvailableRetailStockListComponent, canActivate: [authGuardGuard] },
  { path: 'dropdown-settings', component: DropdownSettingComponent, canActivate: [authGuardGuard], data: { role: 'Owner' }},
  { path: 'packaging-form', component: PackagingFormComponent, canActivate: [authGuardGuard] },
  { path: 'packaging-stack-form', component: PackagingStackFormComponent, canActivate: [authGuardGuard] },
  { path: 'stock-ins', component: StockInListComponent, canActivate: [authGuardGuard] },
  { path: 'stock-outs', component: StockOutListComponent, canActivate: [authGuardGuard] },
  { path: 'edit/:id/packaging', component: PackagingFormComponent, canActivate: [authGuardGuard] },
  { path: 'assigne-list', component: AssigneComponent, canActivate: [authGuardGuard] },
  { path: 'order-creation', component: OrderCreationComponent, canActivate: [authGuardGuard] },
  { path: 'orders-creation', component: OrdersCreationComponent, canActivate: [authGuardGuard] },
  { path: 'design-product', component: DesignProductComponent, canActivate: [authGuardGuard] },
  {
    path: 'kalakaar-management', component: KalakaarManagementComponent, canActivate: [authGuardGuard],
    children: [
      { path: 'home', component: KalakaarHomeComponent, canActivate: [authGuardGuard] },
      { path: 'order', component: OrderComponent, canActivate: [authGuardGuard] },
      { path: 'raw-material', component: RawMaterialComponent, canActivate: [authGuardGuard] },
      { path: 'account', component: AccountComponent, canActivate: [authGuardGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'available-to-produce', component: AvailableToProduceComponent, canActivate: [authGuardGuard] },
  { path: 'material-requirement-sheet', component: MaterialRequirementSheetComponent, canActivate: [authGuardGuard] },
  { path: 'combo-creation', component: ComboCreationComponent, canActivate: [authGuardGuard] },
  { path: 'product-tagging', component: ProductTaggingComponent, canActivate: [authGuardGuard] },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [authGuardGuard],data: { role: 'Owner' } },
  { path: 'taggings-list', component: ProductTaggingListComponent, canActivate: [authGuardGuard] },
  { path: 'tag-labels', component: TagLabelsComponent, canActivate: [authGuardGuard] },
  { path: 'kalakar-list', component: KalakarListComponent, canActivate: [authGuardGuard] },
  { path: 'assembly-container/:id', component: AssemblyContainerComponent, canActivate: [authGuardGuard] },
  { path: 'assembly-brand', component: AssemblyBrandComponent, canActivate: [authGuardGuard] },
];

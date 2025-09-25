import { Component, inject, OnInit } from '@angular/core';
import { NgClass,NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarService } from '../../../Services/navbar.service';
import { FirmService } from '../../../Services/firm.service';
import { FirmSelectionService } from '../../../Services/firm-selection.service';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [NgIf,NgClass,NgFor,RouterLink, FormsModule],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.css',
})
export class HomeNavbarComponent implements OnInit{

  firmnames: string[] = [];
  selectedFirm: string | null | undefined;
  navbarOptions: any[] = [];

  constructor(private firmService:FirmService,private firmSelectionService: FirmSelectionService,private navService: NavbarService){}

  router = inject(Router);

  menuOpen = false;

   // mobile submenu expand/collapse state
  mobileExpanded: string | null = null;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

toggleSubmenu(path: string) {
  this.mobileExpanded = this.mobileExpanded === path ? null : path;
}

navigateTo(path: string) {
  this.router.navigate([path]);
  this.menuOpen = false;       // close mobile menu
  this.mobileExpanded = null;  // collapse submenu
}

  ngOnInit(): void {
    this.firmService.getFirms().subscribe((response: any) => {
      const firms = response.data;
      this.firmnames = firms.map((firm: any) => firm.name);

      // Only set default firm if no firm is already selected
      let alreadySelectedFirm: any;
      this.firmSelectionService.selectedFirmName$.subscribe(firm => {
        alreadySelectedFirm = firm;
        if (firm) {
          this.selectedFirm = firm.name;
        }
      }).unsubscribe();

      if (!alreadySelectedFirm && firms.length > 0) {
        const storedFirmId = localStorage.getItem('firm_id');
        const storedFirm = firms.find((f: any) => f.id == storedFirmId);

        if (storedFirm) {
          this.selectedFirm = storedFirm.name;
          this.firmSelectionService.setselectedFirmName({ id: storedFirm.id, name: storedFirm.name });
        } else {
          const defaultFirm = firms[0];
          this.selectedFirm = defaultFirm.name;
          this.firmSelectionService.setselectedFirmName({ id: defaultFirm.id, name: defaultFirm.name });
        }
      }

    });

    this.loadFirms();  // initial load

    // 👇 NEW: Listen for updates from FirmService
    this.firmService.firmsUpdated$.subscribe(() => {
      this.loadFirms(); // reload whenever a firm is added/edited/deleted
    });

    this.navService.navbarOptions$.subscribe(options => {
      this.navbarOptions = options;
    });

    this.navService.navbarOptions$.subscribe(options => {
      this.navbarOptions = options;
    });
  }


  onFirmChange(name: string) {
    this.firmService.getFirms().subscribe((response: any) => {
      const firm = response.data.find((f: any) => f.name === name);
      if (firm) {
        this.firmSelectionService.setselectedFirmName({ id: firm.id, name: firm.name });
      }
    });
  }

  private loadFirms() {
    this.firmService.getFirms().subscribe((response: any) => {
      const firms = response.data;
      this.firmnames = firms.map((firm: any) => firm.name);

      let alreadySelectedFirm: any;
      this.firmSelectionService.selectedFirmName$.subscribe(firm => {
        alreadySelectedFirm = firm;
        if (firm) {
          this.selectedFirm = firm.name;
        }
      }).unsubscribe();

      if (!alreadySelectedFirm && firms.length > 0) {
        const storedFirmId = localStorage.getItem('firm_id');
        const storedFirm = firms.find((f: any) => f.id == storedFirmId);

        if (storedFirm) {
          this.selectedFirm = storedFirm.name;
          this.firmSelectionService.setselectedFirmName({ id: storedFirm.id, name: storedFirm.name });
        } else {
          const defaultFirm = firms[0];
          this.selectedFirm = defaultFirm.name;
          this.firmSelectionService.setselectedFirmName({ id: defaultFirm.id, name: defaultFirm.name });
        }
      }
    });
  }
}

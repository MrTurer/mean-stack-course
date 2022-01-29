import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Event} from "@angular/router";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.sass']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef

  positions!: Position[]
  loading = false
  modal!: MaterialInstance
  form!: FormGroup
  positionId: any = null

  constructor(
    private positionsService: PositionsService,
  ) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required,Validators.min(1)]),
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId)
      .subscribe(positions => {
        this.positions = positions
        this.loading = false
      })
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnDestroy(): void {
    if (this.modal.destroy) {
      this.modal.destroy()
    }
  }

  onSelectPosition(position: Position) {
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.positionId = position._id
    if (this.modal.open) {
      this.modal.open()
    }
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.form.reset({
      name: null,
      cost: null
    })
    this.positionId = null
    if (this.modal.open) {
      this.modal.open()
    }
  }

  onCancel() {
    if (this.modal.close) {
      this.modal.close()
    }
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    }

    const completed = () => {
      this.form.enable()
      this.form.reset({name: '', cost: null})
      if (this.modal.close) {
        this.modal.close()
      }
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Изменения сохранены')
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана')
          this.positions.push(position)
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        completed
      )
    }
  }

  onDeletePosition(event: MouseEvent, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Удалить позицию "${position.name}"?`)

    if (decision) {
      this.positionsService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}
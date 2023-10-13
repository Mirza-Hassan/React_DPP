import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateDppDto } from './dto/dpp.dto';

@Controller()
export class AppController {
  private dppData: CreateDppDto[] = [];
  private nextDppId = 1;

  @Post('api/dpp/create')
  createDpp(@Body() dppData: CreateDppDto, @Res() res: Response): { message: string, createdDppId: number } {
    try {
      const dppWithId = { ...dppData, id: this.nextDppId++ };
      this.dppData.push(dppWithId);
      const message = 'DPP created successfully';
      res.status(201).json({ message, createdDppId: dppWithId.id });
      return { message, createdDppId: dppWithId.id };
    } catch (error) {
      throw new Error('Failed to create DPP');
    }
  }

  @Get('api/dpp/:id')
  getDpp(@Param('id') id: number, @Res() res: Response): CreateDppDto {
    const dpp = this.dppData.find((item: any) => item.id === +id);
    if (!dpp) {
      res.status(404).json({ message: 'DPP not found' });
      return null;
    }
    return dpp;
  }
  
}

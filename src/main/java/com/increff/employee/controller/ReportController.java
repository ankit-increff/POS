package com.increff.employee.controller;

import com.increff.employee.dto.ReportDto;
import com.increff.employee.model.*;
import com.increff.employee.pojo.DailySalesPojo;
import com.increff.employee.service.ApiException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
@RequestMapping(value = "/api/reports")
public class ReportController {

	@Autowired
	private ReportDto dto;


	@ApiOperation(value = "Gets list of all inventories")
	@RequestMapping(path = "/inventory", method = RequestMethod.POST)
	public List<InventoryReportData> getAllinventory(@RequestBody ReportForm form) throws ApiException {
		return dto.getInventories(form);
	}

	@ApiOperation(value = "Gets list of all brand-categories")
	@RequestMapping(path = "/brand-category", method = RequestMethod.POST)
	public List<BrandForm> getAllBrands(@RequestBody ReportForm form) throws ApiException {
		return dto.getBrands(form);
	}

	@ApiOperation(value = "Gets list of all sales")
	@RequestMapping(path = "/sales", method = RequestMethod.POST)
	public List<SalesReportData> getSales(@RequestBody SalesReportForm form) throws ApiException {
		return dto.getSales(form);
	}

	@ApiOperation(value = "Gets list of daily sales report")
	@RequestMapping(path = "/daily-report", method = RequestMethod.GET)
	public List<DailySalesPojo> getDailySales() throws ApiException {
		return dto.getDailySales();
	}



}

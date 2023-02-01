package com.increff.employee.controller;

import com.increff.employee.dto.InventoryDto;
import com.increff.employee.model.InventoryData;
import com.increff.employee.model.InventoryForm;
import com.increff.employee.service.ApiException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
public class InventoryApiController {

	@Autowired
	private InventoryDto dto;

	@ApiOperation(value = "Adds an inventory")
	@RequestMapping(path = "/api/inventory", method = RequestMethod.POST)
	public void increase(@RequestBody InventoryForm form) throws ApiException {
		dto.increase(form);
	}

	@ApiOperation(value = "Gets an inventory by barcode")
	@RequestMapping(path = "/api/inventory/{barcode}", method = RequestMethod.GET)
	public InventoryData get(@PathVariable String barcode) throws ApiException {
		return dto.get(barcode);
	}

	@ApiOperation(value = "Gets list of all inventories")
	@RequestMapping(path = "/api/inventory", method = RequestMethod.GET)
	public List<InventoryData> getAll() throws ApiException {
		return dto.getAll();
	}

	@ApiOperation(value = "Updates an inventory")
	@RequestMapping(path = "/api/inventory/{barcode}", method = RequestMethod.PUT)
	public void update(@PathVariable String barcode, @RequestBody InventoryForm f) throws ApiException {
		dto.update(barcode,f);
	}

}

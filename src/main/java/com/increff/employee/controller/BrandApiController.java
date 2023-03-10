package com.increff.employee.controller;

import com.increff.employee.dto.BrandDto;
import com.increff.employee.model.BrandData;
import com.increff.employee.model.BrandForm;
import com.increff.employee.model.InfoData;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
@RequestMapping(value = "/api/brand")
public class BrandApiController {

	@Autowired
	private BrandDto dto;
	@Autowired
	private InfoData info;

	@ApiOperation(value = "Adds a brand")
	@RequestMapping(path = "", method = RequestMethod.POST)
	public void add(@RequestBody BrandForm form) throws ApiException {
		dto.add(form);
	}

	@ApiOperation(value = "Gets a brand by ID")
	@RequestMapping(path = "/{id}", method = RequestMethod.GET)
	public BrandData get(@PathVariable int id) throws ApiException {
		return dto.get(id);
	}

	@ApiOperation(value = "Gets list of all brands by name and category")
	@RequestMapping(path = "", params = {"brand", "category"}, method = RequestMethod.GET)
	public List<BrandPojo> getByBrandCategory(@RequestParam(value = "brand") String brand, @RequestParam(value = "category") String category) throws ApiException {
		return dto.getByNameCategory(brand, category);
	}

	@ApiOperation(value = "Gets list of all brands")
	@RequestMapping(path = "", method = RequestMethod.GET)
	public List<BrandData> getAll() {
		return dto.getAll();

	}

	@ApiOperation(value = "Updates a brand")
	@RequestMapping(path = "/{id}", method = RequestMethod.PUT)
	public void update(@PathVariable int id, @RequestBody BrandForm f) throws ApiException {
		dto.update(id, f);
	}

}

package com.increff.employee.service;

import com.increff.employee.dao.InventoryDao;
import com.increff.employee.dao.ProductDao;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.util.StringUtil;
import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class ProductService {

	@Autowired
	private ProductDao dao;
	@Autowired
	private InventoryService inventoryService;

	//ADDING A BRAND
	@Transactional(rollbackOn = ApiException.class)
	public ProductPojo add(ProductPojo p) throws ApiException {
		normalize(p);
		barcodeCheck(p.getBarcode());
		if(StringUtil.isEmpty(p.getName())) {
			throw new ApiException("name cannot be empty");
		}
		ProductPojo productPojo = dao.insert(p);
		InventoryPojo inventoryPojo = new InventoryPojo();
		inventoryPojo.setQuantity(0);
		inventoryPojo.setId(p.getId());
		inventoryService.add(inventoryPojo);
		return productPojo;
	}

	//GETTING A BRAND
	@Transactional(rollbackOn = ApiException.class)
	public ProductPojo get(int id) throws ApiException {
		return getCheck(id);
	}

	//GETTING A BRAND BY BARCODE
	@Transactional(rollbackOn = ApiException.class)
	public ProductPojo get(String barcode) throws ApiException {
		ProductPojo p =  dao.select(barcode);
		if(p==null) {
			throw new ApiException("Barcode doesn't exists!!");
		}
		return p;
	}

	//GET ALL BRANDS
	@Transactional
	public List<ProductPojo> getAll() {
		return dao.selectAll();
	}

	//UPDATE A BRAND
	@Transactional(rollbackOn  = ApiException.class)
	public ProductPojo update(int id, ProductPojo p) throws ApiException {
		normalize(p);
		barcodeCheck(p.getBarcode(),id);
		ProductPojo ex = getCheck(id);
		ex.setMrp(p.getMrp());
		ex.setName(p.getName());
		dao.update(ex);
		return ex;
	}

	//CHECKS:------------------
	@Transactional
	public ProductPojo getCheck(int id) throws ApiException {
		ProductPojo p = dao.select(id);
		if (p == null) {
			throw new ApiException("Brand with given ID does not exit, id: " + id);
		}
		return p;
	}

	@Transactional
	public void barcodeCheck(String barcode) throws ApiException {
		List<ProductPojo> arr = dao.selectAll();
		for(ProductPojo p : arr)
		{
			if(p.getBarcode().equals(barcode)) throw new ApiException("Barcode already exists!!");
		}
		return;
	}

	@Transactional
	public void barcodeCheck(String barcode, int id) throws ApiException {
		List<ProductPojo> arr = dao.selectAll();
		for(ProductPojo p : arr)
		{
			if(p.getBarcode().equals(barcode) && p.getId()!=id) throw new ApiException("Barcode already exists!!");
		}
		return;
	}

	protected static void normalize(ProductPojo p) {
		p.setName(StringUtil.toLowerCase(p.getName()));
	}
}

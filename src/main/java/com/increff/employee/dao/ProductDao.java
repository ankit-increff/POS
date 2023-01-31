package com.increff.employee.dao;

import com.increff.employee.pojo.ProductPojo;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Repository
public class ProductDao extends AbstractDao {

	private static String select_id = "select p from ProductPojo p where id=:id";
	private static String select_barcode = "select p from ProductPojo p where barcode=:barcode";
	private static String select_all = "select p from ProductPojo p";

	@PersistenceContext
	private EntityManager em;

	@Transactional
	public ProductPojo insert(ProductPojo p) {
//		System.out.println(p.getName()+p.getId()+p.getBarcode()+p.getMrp()+p.getBrandId());
		em.persist(p);
		return p;
	}

	public ProductPojo select(int id) {
		TypedQuery<ProductPojo> query = getQuery(select_id, ProductPojo.class);
		query.setParameter("id", id);
		return getSingle(query);
	}

	public ProductPojo select(String barcode) {
		TypedQuery<ProductPojo> query = getQuery(select_barcode, ProductPojo.class);
		query.setParameter("barcode", barcode);
		return getSingle(query);
	}


	public List<ProductPojo> selectAll() {
		TypedQuery<ProductPojo> query = getQuery(select_all, ProductPojo.class);
		return query.getResultList();
	}

	public void update(ProductPojo p) {
	}



}
